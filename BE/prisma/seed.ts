import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

async function main() {
  const password = await bcrypt.hash("password123", saltRounds);

  const admin = await prisma.user.upsert({
    where: { email: "zafar@gmail.com" },
    update: { name: "Zafar Admin", password, role: "creator" },
    create: { email: "zafar@gmail.com", name: "Zafar Admin", password, role: "creator" },
  });

  console.log("Seeded user:", admin.email);

  const contestsData = [
    {
      title: "Night Sprint 42",
      description: "Fast-paced 90 min round with implementation-heavy tasks and tight time constraints.",
      start_time: new Date("2026-04-20T17:00:00.000Z"),
      end_time: new Date("2026-04-20T18:30:00.000Z"),
      tags: ["implementation", "greedy"],
      dsa: [
        {
          title: "Binary Search Range",
          description: "Find the leftmost and rightmost positions of a target in a sorted array.",
          tags: ["binary-search"],
          points: 100,
          time_limit: 1000,
          memory_limit: 256,
          testCases: [
            { input: "5 3\n1 2 3 3 4", expectedOutput: "2 3", isHidden: false },
            { input: "4 5\n1 2 3 4", expectedOutput: "-1 -1", isHidden: true },
          ],
        },
        {
          title: "Greedy Interval Cover",
          description: "Cover the range [0, M] using minimum number of intervals.",
          tags: ["greedy"],
          points: 200,
          time_limit: 1500,
          memory_limit: 256,
          testCases: [
            { input: "3 6\n0 2\n1 4\n3 6", expectedOutput: "2", isHidden: false },
            { input: "2 5\n0 3\n3 5", expectedOutput: "2", isHidden: true },
          ],
        },
      ],
    },
    {
      title: "Graph Masters Open",
      description: "Weighted paths, shortest routes, and dynamic constraints across graph structures.",
      start_time: new Date("2026-04-22T13:30:00.000Z"),
      end_time: new Date("2026-04-22T16:00:00.000Z"),
      tags: ["graphs", "bfs", "dijkstra"],
      dsa: [
        {
          title: "Shortest Teleport Path",
          description: "Find shortest path from source to destination with teleport edges.",
          tags: ["graphs", "bfs"],
          points: 250,
          time_limit: 2000,
          memory_limit: 256,
          testCases: [
            { input: "4 4\n1 2\n2 3\n3 4\n1 4", expectedOutput: "1", isHidden: false },
            { input: "3 2\n1 2\n2 3", expectedOutput: "2", isHidden: true },
          ],
        },
        {
          title: "Segment Tree Beats",
          description: "Range chmin queries with segment tree beats technique.",
          tags: ["segment-tree", "data-structures"],
          points: 500,
          time_limit: 3000,
          memory_limit: 512,
          testCases: [
            { input: "5 3\n1 5 3 2 4\n1 3 4\n2 1 5\n3 2 4", expectedOutput: "4\n3", isHidden: false },
            { input: "3 1\n6 3 5\n2 1 3", expectedOutput: "6", isHidden: true },
          ],
        },
      ],
    },
    {
      title: "DP Gauntlet",
      description: "Pure dynamic programming from classic knapsack to interval DP and bitmask tricks.",
      start_time: new Date("2026-04-23T10:00:00.000Z"),
      end_time: new Date("2026-04-23T13:00:00.000Z"),
      tags: ["dynamic-programming", "bitmask"],
      dsa: [
        {
          title: "0-1 Knapsack",
          description: "Classic knapsack problem — maximize value within weight capacity.",
          tags: ["dynamic-programming"],
          points: 150,
          time_limit: 1000,
          memory_limit: 256,
          testCases: [
            { input: "3 5\n2 3\n3 4\n4 5", expectedOutput: "7", isHidden: false },
            { input: "1 10\n5 8", expectedOutput: "8", isHidden: true },
          ],
        },
        {
          title: "Bitmask DP on Subsets",
          description: "Assign tasks to workers minimizing cost using bitmask DP.",
          tags: ["bitmask", "dynamic-programming"],
          points: 400,
          time_limit: 2000,
          memory_limit: 256,
          testCases: [
            { input: "3\n9 2 7\n6 4 3\n5 8 1", expectedOutput: "13", isHidden: false },
          ],
        },
      ],
    },
    {
      title: "Binary Blitz",
      description: "Binary search on answer, search on functions, and predicates under pressure.",
      start_time: new Date("2026-04-24T15:00:00.000Z"),
      end_time: new Date("2026-04-24T16:30:00.000Z"),
      tags: ["binary-search", "math"],
      dsa: [
        {
          title: "Minimum Max Distance",
          description: "Place K stations to minimize the maximum distance between adjacent stations.",
          tags: ["binary-search"],
          points: 300,
          time_limit: 1500,
          memory_limit: 256,
          testCases: [
            { input: "5 2\n1 3 6 10 19", expectedOutput: "5", isHidden: false },
            { input: "2 1\n1 100", expectedOutput: "99", isHidden: true },
          ],
        },
      ],
    },
    {
      title: "String Theory Cup",
      description: "Hashing, KMP, Z-function, and suffix arrays in a strings-only battle.",
      start_time: new Date("2026-04-25T09:00:00.000Z"),
      end_time: new Date("2026-04-25T11:30:00.000Z"),
      tags: ["strings", "hashing"],
      dsa: [
        {
          title: "Rolling Hash Duel",
          description: "Find all occurrences of pattern P in string S using rolling hash.",
          tags: ["strings", "hashing"],
          points: 300,
          time_limit: 1500,
          memory_limit: 256,
          testCases: [
            { input: "abcabc\nabc", expectedOutput: "0 3", isHidden: false },
            { input: "aaa\naa", expectedOutput: "0 1", isHidden: true },
          ],
        },
        {
          title: "Longest Palindromic Substring",
          description: "Find the longest palindromic substring using Manacher's algorithm.",
          tags: ["strings"],
          points: 350,
          time_limit: 1000,
          memory_limit: 256,
          testCases: [
            { input: "babad", expectedOutput: "bab", isHidden: false },
            { input: "cbbd", expectedOutput: "bb", isHidden: true },
          ],
        },
      ],
    },
    {
      title: "Data Structures Duel",
      description: "Segment trees, BITs, sparse tables, and persistent structures under the clock.",
      start_time: new Date("2026-04-26T14:00:00.000Z"),
      end_time: new Date("2026-04-26T17:00:00.000Z"),
      tags: ["data-structures", "segment-tree"],
      dsa: [
        {
          title: "Range Sum Query",
          description: "Answer range sum queries after point updates using a Fenwick tree.",
          tags: ["data-structures", "bit"],
          points: 200,
          time_limit: 1000,
          memory_limit: 256,
          testCases: [
            { input: "5\n1 2 3 4 5\n2\n1 3\n2 5", expectedOutput: "6\n14", isHidden: false },
          ],
        },
        {
          title: "Segment Tree Beats",
          description: "Range chmin operations with sum queries.",
          tags: ["segment-tree"],
          points: 500,
          time_limit: 3000,
          memory_limit: 512,
          testCases: [
            { input: "4\n6 3 5 2\n1\n1 3 4", expectedOutput: "12", isHidden: false },
          ],
        },
      ],
    },
    {
      title: "Math Olympiad Round",
      description: "Number theory, combinatorics, modular arithmetic, and prime sieves.",
      start_time: new Date("2026-04-27T11:00:00.000Z"),
      end_time: new Date("2026-04-27T13:00:00.000Z"),
      tags: ["math", "number-theory"],
      dsa: [
        {
          title: "GCD Queries",
          description: "Answer multiple GCD queries on subarrays efficiently.",
          tags: ["math", "number-theory"],
          points: 200,
          time_limit: 1000,
          memory_limit: 256,
          testCases: [
            { input: "4 2\n4 6 12 8\n1 3\n2 4", expectedOutput: "2\n2", isHidden: false },
          ],
        },
        {
          title: "Count Primes in Range",
          description: "Count prime numbers in range [L, R] using segmented sieve.",
          tags: ["math", "sieve"],
          points: 250,
          time_limit: 2000,
          memory_limit: 256,
          testCases: [
            { input: "1 10", expectedOutput: "4", isHidden: false },
            { input: "10 20", expectedOutput: "4", isHidden: true },
          ],
        },
      ],
    },
    {
      title: "Greedy Games",
      description: "Exchange arguments, interval scheduling, and activity selection problems.",
      start_time: new Date("2026-04-28T16:00:00.000Z"),
      end_time: new Date("2026-04-28T17:30:00.000Z"),
      tags: ["greedy", "implementation"],
      dsa: [
        {
          title: "Activity Selection",
          description: "Select maximum number of non-overlapping activities.",
          tags: ["greedy"],
          points: 150,
          time_limit: 1000,
          memory_limit: 256,
          testCases: [
            { input: "3\n1 3\n2 4\n3 5", expectedOutput: "2", isHidden: false },
            { input: "4\n1 2\n3 4\n0 6\n5 7", expectedOutput: "3", isHidden: true },
          ],
        },
      ],
    },
  ];

  for (const c of contestsData) {
    const existing = await prisma.contest.findFirst({ where: { title: c.title } });
    if (existing) {
      console.log(`Skipping existing contest: ${c.title}`);
      continue;
    }

    const contest = await prisma.contest.create({
      data: {
        title: c.title,
        description: c.description,
        start_time: c.start_time,
        end_time: c.end_time,
        creator_id: admin.id,
      },
    });

    for (const problem of c.dsa) {
      await prisma.dsaProblems.create({
        data: {
          title: problem.title,
          description: problem.description,
          tags: problem.tags,
          points: problem.points,
          time_limit: problem.time_limit,
          memory_limit: problem.memory_limit,
          contest_id: contest.id,
          testCases: {
            create: problem.testCases.map((tc) => ({
              input: tc.input,
              expected_output: tc.expectedOutput,
              is_hidden: tc.isHidden,
            })),
          },
        },
      });
    }

    console.log(`Seeded contest: ${c.title}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
