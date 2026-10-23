import assert from "node:assert/strict";
import test, { describe, it } from "node:test";
import {
  AURA_CONSTANTS,
  AURA_TIERS,
  getAuraTier,
  evaluateCategoryBadges,
  calculateAuraBreakdown,
} from "./aura-system";

describe("Aura Point & Gamification Engine (Instance 2)", () => {
  it("computes the 8 authentic tier thresholds accurately", () => {
    // 0 points -> NPC
    assert.equal(getAuraTier(0).currentTier.id, "npc");
    assert.equal(getAuraTier(499).currentTier.id, "npc");
    assert.equal(getAuraTier(499).pointsToNextTier, 1);

    // 500 points -> Chad
    assert.equal(getAuraTier(500).currentTier.id, "chad");
    assert.equal(getAuraTier(2499).currentTier.id, "chad");

    // 2500 points -> Mega Chad
    assert.equal(getAuraTier(2500).currentTier.id, "mega_chad");

    // 5000 points -> Giga Chad
    assert.equal(getAuraTier(5000).currentTier.id, "giga_chad");

    // 10000 points -> Ultra Chad
    assert.equal(getAuraTier(10000).currentTier.id, "ultra_chad");

    // 17500 points -> Alpha Supreme
    assert.equal(getAuraTier(17500).currentTier.id, "alpha_supreme");

    // 30000 points -> Sigma Eternal
    assert.equal(getAuraTier(30000).currentTier.id, "sigma_eternal");

    // 50000 points -> Final Boss
    const finalBoss = getAuraTier(55000);
    assert.equal(finalBoss.currentTier.id, "final_boss");
    assert.equal(finalBoss.nextTier, null);
    assert.equal(finalBoss.pointsToNextTier, 0);
    assert.equal(finalBoss.tierProgressPercent, 100);
  });

  it("calculates points from topics and problems accurately", () => {
    const breakdown = calculateAuraBreakdown({
      completedTopicIds: ["t1", "t2"],
      practicingTopicIds: ["t3", "t4", "t5"],
      solvedProblemIds: ["p1", "p2", "p3", "p4"],
      cfProfile: null,
      dailyStreak: {
        currentStreak: 1,
        bestStreak: 1,
        totalCheckIns: 1,
        lastCheckInDate: "2026-01-01",
        totalStreakAura: 25,
      },
    });

    // 2 completed topics * 96 = 192
    assert.equal(breakdown.topicsCompleted.totalPoints, 192);
    // 3 practicing topics * 16 = 48
    assert.equal(breakdown.topicsPracticing.totalPoints, 48);
    // 4 problems solved * 32 = 128
    assert.equal(breakdown.problemsSolved.totalPoints, 128);

    // Total = 192 + 48 + 128 + 0 (badges) + 0 (CF) + 25 (streak) = 393
    assert.equal(breakdown.totalAura, 393);
    assert.equal(breakdown.currentTier.id, "npc");
  });

  it("calculates Codeforces rating points with a 2x multiplier", () => {
    const breakdown = calculateAuraBreakdown({
      completedTopicIds: [],
      practicingTopicIds: [],
      solvedProblemIds: [],
      cfProfile: {
        handle: "tourist",
        rating: 3343,
        maxRating: 4009,
        rank: "legendary grandmaster",
        maxRank: "tourist",
        lastSyncedAt: new Date().toISOString(),
      },
      dailyStreak: {
        currentStreak: 1,
        bestStreak: 1,
        totalCheckIns: 1,
        lastCheckInDate: "2026-01-01",
        totalStreakAura: 25,
      },
    });

    // 4009 maxRating * 2 = 8018 Aura
    assert.equal(breakdown.codeforces.auraEarned, 8018);
    // Total = 8018 + 25 = 8043 Aura -> Giga Chad (5000 - 9999)
    assert.equal(breakdown.totalAura, 8043);
    assert.equal(breakdown.currentTier.id, "giga_chad");
  });

  it("evaluates category badges with 35% Bronze, 60% Silver, and 90% Gold milestones", () => {
    const mockTopics = Array.from({ length: 25 }, (_, i) => `b_${i + 1}`);
    const mockCategories = [
      {
        category_id: "test_cat",
        category_title: "Test Category",
        sub_categories: [
          {
            sub_category_id: "sub_1",
            sub_category_title: "Sub 1",
            topics: mockTopics.map((id) => ({
              topic_id: id,
              topic_title: id,
              difficulty: 1,
              importance: 1,
            })),
          },
        ],
      },
    ];

    // 10 out of 25 = 40% (Bronze unlocked, Silver locked)
    const evaluatedBronze = evaluateCategoryBadges(
      mockTopics.slice(0, 10),
      mockCategories as any
    );
    assert.equal(evaluatedBronze.bronzeCount, 1);
    assert.equal(evaluatedBronze.silverCount, 0);
    assert.equal(evaluatedBronze.goldCount, 0);
    assert.equal(evaluatedBronze.totalPoints, AURA_CONSTANTS.CATEGORY_BRONZE_POINTS);

    // 16 out of 25 = 64% (Bronze + Silver unlocked)
    const evaluatedSilver = evaluateCategoryBadges(
      mockTopics.slice(0, 16),
      mockCategories as any
    );
    assert.equal(evaluatedSilver.bronzeCount, 1);
    assert.equal(evaluatedSilver.silverCount, 1);
    assert.equal(evaluatedSilver.goldCount, 0);
    assert.equal(
      evaluatedSilver.totalPoints,
      AURA_CONSTANTS.CATEGORY_BRONZE_POINTS + AURA_CONSTANTS.CATEGORY_SILVER_POINTS
    );

    // 24 out of 25 = 96% (Bronze + Silver + Gold unlocked)
    const evaluatedGold = evaluateCategoryBadges(
      mockTopics.slice(0, 24),
      mockCategories as any
    );
    assert.equal(evaluatedGold.bronzeCount, 1);
    assert.equal(evaluatedGold.silverCount, 1);
    assert.equal(evaluatedGold.goldCount, 1);
    assert.equal(
      evaluatedGold.totalPoints,
      AURA_CONSTANTS.CATEGORY_BRONZE_POINTS +
        AURA_CONSTANTS.CATEGORY_SILVER_POINTS +
        AURA_CONSTANTS.CATEGORY_GOLD_POINTS
    );
  });
});
