const express = require('express');
const router = express.Router();
const College = require('../models/College');

// Smart Ranking Score Calculator
const calculateScore = (college, params) => {
  let score = 0;
  const { budget, preferred_state, preferred_course, category = 'General' } = params;

  // Placement score (0-30 pts)
  if (college.placements.percentage >= 90) score += 30;
  else if (college.placements.percentage >= 75) score += 22;
  else if (college.placements.percentage >= 60) score += 14;
  else score += 6;

  // Package score (0-20 pts)
  const pkg = college.placements.avgPackage / 100000;
  if (pkg >= 10) score += 20;
  else if (pkg >= 6) score += 15;
  else if (pkg >= 4) score += 10;
  else score += 4;

  // Ranking score (0-25 pts)
  if (college.ranking <= 50) score += 25;
  else if (college.ranking <= 150) score += 18;
  else if (college.ranking <= 300) score += 12;
  else score += 5;

  // State preference (0-10 pts)
  if (preferred_state && college.state.toLowerCase() === preferred_state.toLowerCase()) score += 10;

  // Budget fit (0-15 pts)
  const catMap = { General: 'general', OBC: 'obc', SC: 'sc', ST: 'st', EWS: 'ews' };
  const catKey = catMap[category] || 'general';

  let cheapestFee = Infinity;
  if (preferred_course) {
    const matchCourse = college.courses.find(c =>
      c.name.toLowerCase().includes(preferred_course.toLowerCase())
    );
    if (matchCourse) cheapestFee = matchCourse.fees.tuition + matchCourse.fees.hostel + matchCourse.fees.other;
  } else {
    college.courses.forEach(c => {
      const total = c.fees.tuition + c.fees.hostel + c.fees.other;
      if (total < cheapestFee) cheapestFee = total;
    });
  }

  if (budget && cheapestFee <= budget) score += 15;
  else if (budget && cheapestFee <= budget * 1.2) score += 8;

  return { score, cheapestFee };
};

// Check eligibility
const checkEligibility = (college, params) => {
  const { twelfth_percentage, entrance_score, exam_type, preferred_course, category = 'General' } = params;
  const catMap = { General: 'general', OBC: 'obc', SC: 'sc', ST: 'st', EWS: 'ews' };
  const catKey = catMap[category] || 'general';

  let eligibleCourses = [];
  let matchPercentage = 0;

  for (const course of college.courses) {
    if (preferred_course && !course.name.toLowerCase().includes(preferred_course.toLowerCase())) continue;

    let cutoffScore = course.cutoff[catKey] || course.cutoff.general;
    let examMatch = !exam_type || course.examAccepted.includes(exam_type) || course.examAccepted.length === 0;

    // JEE/NEET/CUET based cutoff check
    let scoreEligible = true;
    if (entrance_score && cutoffScore) {
      if (['JEE', 'JEE Main', 'JEE Advanced'].includes(exam_type)) {
        scoreEligible = entrance_score >= cutoffScore;
      } else {
        scoreEligible = (entrance_score / 360 * 100) >= cutoffScore || twelfth_percentage >= cutoffScore;
      }
    } else if (twelfth_percentage && cutoffScore) {
      scoreEligible = twelfth_percentage >= cutoffScore;
    }

    if (examMatch && scoreEligible) {
      eligibleCourses.push(course.name);
      matchPercentage += 20;
    } else if (examMatch) {
      matchPercentage += 5;
    }
  }

  matchPercentage = Math.min(matchPercentage + 40, 100);
  return { eligible: eligibleCourses.length > 0, eligibleCourses, matchPercentage };
};

// @route POST /api/recommend
router.post('/', async (req, res) => {
  try {
    const {
      tenth_percentage,
      twelfth_percentage,
      entrance_score,
      exam_type,
      budget,
      preferred_course,
      preferred_state,
      category = 'General',
      page = 1,
      limit = 12
    } = req.body;

    // Build initial filter
    let query = { isActive: true };

    // Tier logic based on JEE rank / score
    if (exam_type === 'JEE' || exam_type === 'JEE Main') {
      if (entrance_score >= 150) query.tier = 'Tier 1';
      else if (entrance_score >= 80) query.$or = [{ tier: 'Tier 1' }, { tier: 'Tier 2' }];
    } else if (twelfth_percentage >= 90) {
      query.$or = [{ tier: 'Tier 1' }, { tier: 'Tier 2' }];
    }

    const colleges = await College.find(query).select('-reviews');

    // Score and rank all colleges
    let results = colleges.map(college => {
      const { score, cheapestFee } = calculateScore(college, { budget, preferred_state, preferred_course, category });
      const { eligible, eligibleCourses, matchPercentage } = checkEligibility(college, {
        twelfth_percentage, entrance_score, exam_type, preferred_course, category
      });

      return {
        college: {
          _id: college._id,
          collegeName: college.collegeName,
          shortName: college.shortName,
          state: college.state,
          city: college.city,
          type: college.type,
          tier: college.tier,
          ranking: college.ranking,
          accreditation: college.accreditation,
          imageURL: college.imageURL,
          placements: college.placements,
          facilities: college.facilities,
          courses: college.courses.map(c => c.name),
          avgRating: college.avgRating,
          cheapestFee
        },
        score,
        eligible,
        eligibleCourses,
        matchPercentage
      };
    });

    // Sort: eligible first, then by score
    results.sort((a, b) => {
      if (a.eligible && !b.eligible) return -1;
      if (!a.eligible && b.eligible) return 1;
      return b.score - a.score;
    });

    const total = results.length;
    const paginated = results.slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      results: paginated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
