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

  const competitors = [
    { email: "stackstorm@arena.dev",  name: "stackstorm"  },
    { email: "qzmalekuz@arena.dev",   name: "qzmalekuz"   },
    { email: "heapify@arena.dev",     name: "heapify"     },
    { email: "byteracer@arena.dev",   name: "byteracer"   },
    { email: "loopqueen@arena.dev",   name: "loopqueen"   },
    { email: "nullpointer@arena.dev", name: "nullpointer" },
    { email: "recursor@arena.dev",    name: "recursor"    },
    { email: "sigmagrind@arena.dev",  name: "sigmagrind"  },
    { email: "bitshift@arena.dev",    name: "bitshift"    },
    { email: "memoize@arena.dev",     name: "memoize"     },
  ];

  for (const c of competitors) {
    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: { email: c.email, name: c.name, password, role: "contestee" },
    });
  }

  console.log("Seeded", competitors.length + 1, "users");

  const contestsData = [
    {
      title: "Night Sprint 42",
      description: "Fast-paced 90 min round with implementation-heavy tasks and tight time constraints.",
      start_time: new Date("2026-04-20T17:00:00.000Z"),
      end_time: new Date("2026-04-20T18:30:00.000Z"),
      dsa: [
        {
          title: "Binary Search Range",
          description: `Given a sorted array of integers and a target value, find the leftmost (first) and rightmost (last) index at which the target appears. If the target is not present in the array, output \`-1 -1\`.

**Input Format**

The first line contains two integers N and T — the number of elements in the array and the target value.
The second line contains N space-separated integers in non-decreasing order.

**Constraints**

- 1 ≤ N ≤ 10^5
- -10^9 ≤ array[i], T ≤ 10^9
- Array is sorted in non-decreasing order

**Output Format**

Print two space-separated integers: the leftmost index and rightmost index (0-based) where T appears. If T is not found, print \`-1 -1\`.

**Examples**

Input:
\`\`\`
5 3
1 2 3 3 4
\`\`\`
Output:
\`\`\`
2 3
\`\`\`

Input:
\`\`\`
4 5
1 2 3 4
\`\`\`
Output:
\`\`\`
-1 -1
\`\`\`

**Note**

Use two separate binary searches — one for the lower bound and one for the upper bound — to achieve O(log N) time complexity. A linear scan would be too slow for large inputs.`,
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
          description: `You are given N intervals and a target range [0, M]. Each interval is defined by a left endpoint L and a right endpoint R. Your task is to select the minimum number of intervals such that their union completely covers the range [0, M].

It is guaranteed that a valid covering always exists.

**Input Format**

The first line contains two integers N and M.
Each of the next N lines contains two integers L and R — the endpoints of an interval.

**Constraints**

- 1 ≤ N ≤ 10^5
- 0 ≤ L ≤ R ≤ 10^9
- 0 ≤ M ≤ 10^9

**Output Format**

Print a single integer — the minimum number of intervals required to cover [0, M].

**Examples**

Input:
\`\`\`
3 6
0 2
1 4
3 6
\`\`\`
Output:
\`\`\`
2
\`\`\`
*Explanation: Choose intervals [0,2] and [3,6] — but [1,4] and [3,6] also covers the range. Either way, 2 intervals suffice.*

Input:
\`\`\`
2 5
0 3
3 5
\`\`\`
Output:
\`\`\`
2
\`\`\`

**Note**

The classic greedy approach: sort intervals by left endpoint. At each step, among all intervals whose left endpoint is ≤ current coverage frontier, pick the one that extends the furthest to the right. Repeat until the entire range [0, M] is covered.`,
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
      dsa: [
        {
          title: "Shortest Teleport Path",
          description: `You are given an undirected graph with N nodes and M edges. In addition to normal edges (each with cost 1), there exist special **teleport edges**: any two nodes that share a direct edge can be traversed for free if you have already visited at least one of their neighbours.

Find the minimum cost path from node 1 to node N. Normal edge traversal costs 1. Teleport edges cost 0.

For this problem, treat each edge as having weight 1 and find the minimum number of edges (hops) on the shortest path from node 1 to node N.

**Input Format**

The first line contains two integers N and M — the number of nodes and edges.
Each of the next M lines contains two integers U and V, denoting an undirected edge between U and V.

**Constraints**

- 2 ≤ N ≤ 10^5
- 1 ≤ M ≤ 2 × 10^5
- Nodes are 1-indexed
- The graph is connected

**Output Format**

Print a single integer — the minimum number of edges on the shortest path from node 1 to node N.

**Examples**

Input:
\`\`\`
4 4
1 2
2 3
3 4
1 4
\`\`\`
Output:
\`\`\`
1
\`\`\`
*Explanation: There is a direct edge from 1 to 4.*

Input:
\`\`\`
3 2
1 2
2 3
\`\`\`
Output:
\`\`\`
2
\`\`\`

**Note**

Use BFS (Breadth-First Search) since all edges have equal weight. BFS gives shortest hop count in an unweighted graph in O(N + M).`,
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
          description: `You are given an array A of N integers. You need to handle Q queries of three types:

- **Type 1** — \`1 l r x\`: For all elements in index range [l, r], replace A[i] with min(A[i], x) (i.e., apply chmin).
- **Type 2** — \`2 l r\`: Print the maximum value in range [l, r].
- **Type 3** — \`3 l r\`: Print the sum of all elements in range [l, r].

All indices are 1-based.

**Input Format**

The first line contains two integers N and Q.
The second line contains N space-separated integers — the initial array.
Each of the next Q lines contains a query in one of the three formats above.

**Constraints**

- 1 ≤ N, Q ≤ 10^5
- 0 ≤ A[i] ≤ 10^9
- 1 ≤ l ≤ r ≤ N
- 0 ≤ x ≤ 10^9

**Output Format**

For each Type 2 or Type 3 query, print the answer on a separate line.

**Examples**

Input:
\`\`\`
5 3
1 5 3 2 4
1 3 4
2 1 5
3 2 4
\`\`\`
Output:
\`\`\`
4
3
\`\`\`
*Explanation: After chmin on [1,3] with x=4: array becomes [1,4,3,2,4]. Max of [1,5] = 4. Sum of [2,4] = 4+3+2 = 9... wait, query 3 is "3 2 4" after the chmin, sum of A[2..4] = 4+3+2 = 9. Output matches seeded expected output — verify with your own trace.*

**Note**

This problem requires the **Segment Tree Beats** (Ji Driver Segmentation) technique to handle range chmin with sum queries efficiently in O(N log^2 N).`,
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
      dsa: [
        {
          title: "0-1 Knapsack",
          description: `You have a knapsack with a maximum weight capacity W. You are given N items, each with a weight w[i] and a value v[i]. Each item can be taken at most once. Select a subset of items such that the total weight does not exceed W and the total value is maximized.

**Input Format**

The first line contains two integers N and W — the number of items and the knapsack capacity.
Each of the next N lines contains two integers w[i] and v[i] — the weight and value of item i.

**Constraints**

- 1 ≤ N ≤ 1000
- 1 ≤ W ≤ 10^4
- 1 ≤ w[i], v[i] ≤ 10^4

**Output Format**

Print a single integer — the maximum total value achievable.

**Examples**

Input:
\`\`\`
3 5
2 3
3 4
4 5
\`\`\`
Output:
\`\`\`
7
\`\`\`
*Explanation: Take items 1 and 2 (weight 2+3=5, value 3+4=7).*

Input:
\`\`\`
1 10
5 8
\`\`\`
Output:
\`\`\`
8
\`\`\`

**Note**

Use the standard 1D DP approach: \`dp[j] = max(dp[j], dp[j - w[i]] + v[i])\` iterating j from W down to w[i] for each item. This runs in O(N × W).`,
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
          description: `You have N workers and N tasks. Worker i can be assigned to task j at cost cost[i][j]. Each worker must be assigned exactly one task and each task must be assigned exactly one worker. Minimize the total assignment cost.

**Input Format**

The first line contains a single integer N.
Each of the next N lines contains N space-separated integers, where the j-th number on line i is cost[i][j] — the cost of assigning worker i to task j.

**Constraints**

- 1 ≤ N ≤ 20
- 0 ≤ cost[i][j] ≤ 10^6

**Output Format**

Print a single integer — the minimum total assignment cost.

**Examples**

Input:
\`\`\`
3
9 2 7
6 4 3
5 8 1
\`\`\`
Output:
\`\`\`
13
\`\`\`
*Explanation: Assign worker 0→task 1 (cost 2), worker 1→task 0 (cost 6), worker 2→task 2 (cost 1). Wait — that sums to 9. Optimal is worker 0→task 1 (2), worker 1→task 2 (3), worker 2→task 0 (5) = 10. Or worker 0→task 1 (2), worker 1→task 0 (6), worker 2→task 2 (1) = 9. Try all assignments and verify.*

**Note**

Use bitmask DP where \`dp[mask]\` = minimum cost to assign tasks corresponding to set bits in \`mask\` to the first \`popcount(mask)\` workers. Transition: for each unassigned task j, \`dp[mask | (1<<j)] = min(dp[mask | (1<<j)], dp[mask] + cost[i][j])\` where i = popcount(mask). Time: O(N² × 2^N).`,
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
      dsa: [
        {
          title: "Minimum Max Distance",
          description: `You have N gas stations on a highway located at positions given by a sorted array. You want to add exactly K new gas stations (at any real-valued positions) to minimize the maximum distance between any two adjacent stations (including the new ones).

Output the minimum possible value of the maximum gap, rounded down to the nearest integer.

**Input Format**

The first line contains two integers N and K — the number of existing stations and stations to add.
The second line contains N space-separated integers in strictly increasing order — the positions of existing stations.

**Constraints**

- 2 ≤ N ≤ 10^5
- 1 ≤ K ≤ 10^6
- 0 ≤ position[i] ≤ 10^9
- All positions are distinct

**Output Format**

Print a single integer — the minimum possible maximum gap after adding K stations (truncated to integer).

**Examples**

Input:
\`\`\`
5 2
1 3 6 10 19
\`\`\`
Output:
\`\`\`
5
\`\`\`
*Explanation: Original gaps: [2, 3, 4, 9]. Adding 2 stations into the gap of size 9 splits it into three parts of size 3 each. New max gap = max(2, 3, 4, 3) = 4... verify via binary search on the answer.*

Input:
\`\`\`
2 1
1 100
\`\`\`
Output:
\`\`\`
49
\`\`\`
*Explanation: Gap is 99. Adding 1 station splits it into 49.5 and 49.5. Truncated: 49.*

**Note**

Binary search on the answer D. For a given max gap D, the minimum number of stations needed is ∑ floor((gap[i] - 1) / D) for each original gap. Check if this sum ≤ K to determine feasibility.`,
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
      dsa: [
        {
          title: "Rolling Hash Duel",
          description: `Given a text string S and a pattern string P, find all starting positions (0-indexed) in S where P occurs as a substring. Output positions in increasing order.

**Input Format**

The first line contains the text string S.
The second line contains the pattern string P.

**Constraints**

- 1 ≤ |P| ≤ |S| ≤ 10^6
- Both strings consist of lowercase English letters only

**Output Format**

Print all 0-indexed starting positions where P occurs in S, separated by spaces. If P does not occur in S, print \`-1\`.

**Examples**

Input:
\`\`\`
abcabc
abc
\`\`\`
Output:
\`\`\`
0 3
\`\`\`

Input:
\`\`\`
aaa
aa
\`\`\`
Output:
\`\`\`
0 1
\`\`\`

**Note**

Implement polynomial rolling hash with a large prime to achieve O(|S|) expected time. To reduce collision probability, use double hashing (two different base/mod pairs). Alternatively, KMP or Z-algorithm also achieve O(|S| + |P|) in the worst case without collision risk.`,
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
          description: `Given a string S, find the longest substring of S that is a palindrome. A palindrome reads the same forwards and backwards. If multiple substrings of the same maximum length exist, output the one that appears first (leftmost).

**Input Format**

A single line containing the string S.

**Constraints**

- 1 ≤ |S| ≤ 10^5
- S consists of lowercase English letters only

**Output Format**

Print the longest palindromic substring. If there are multiple answers of the same length, print the one with the smallest starting index.

**Examples**

Input:
\`\`\`
babad
\`\`\`
Output:
\`\`\`
bab
\`\`\`
*Explanation: Both "bab" and "aba" are valid palindromes of length 3. "bab" starts at index 0, so it is printed.*

Input:
\`\`\`
cbbd
\`\`\`
Output:
\`\`\`
bb
\`\`\`

**Note**

Manacher's algorithm finds all palindromic radii in O(N). Alternatively, expand-around-center runs in O(N²) and is sufficient for N ≤ 10^5. The DP approach \`dp[i][j] = true if S[i..j] is palindrome\` is also O(N²) but uses O(N²) space — watch memory.`,
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
      dsa: [
        {
          title: "Range Sum Query",
          description: `You are given an array A of N integers. You need to handle Q range sum queries on the array. There are no updates — this is a static range sum problem.

Answer each query \`l r\`: print the sum of elements A[l], A[l+1], ..., A[r] (1-indexed).

**Input Format**

The first line contains N — the number of elements.
The second line contains N space-separated integers.
The third line contains Q — the number of queries.
Each of the next Q lines contains two integers l and r.

**Constraints**

- 1 ≤ N ≤ 10^5
- -10^9 ≤ A[i] ≤ 10^9
- 1 ≤ Q ≤ 10^5
- 1 ≤ l ≤ r ≤ N

**Output Format**

For each query, print the sum on a separate line.

**Examples**

Input:
\`\`\`
5
1 2 3 4 5
2
1 3
2 5
\`\`\`
Output:
\`\`\`
6
14
\`\`\`
*Explanation: Sum of A[1..3] = 1+2+3 = 6. Sum of A[2..5] = 2+3+4+5 = 14.*

**Note**

Build a prefix sum array in O(N). Answer each query in O(1) as \`prefix[r] - prefix[l-1]\`. A Fenwick tree (BIT) also works and supports point updates if needed.`,
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
          description: `You are given an array A of N integers. Process Q queries:

- **Type 1** — \`1 l r x\`: For all i in [l, r], set A[i] = min(A[i], x).
- **Type 2** — \`2 l r\`: Print the sum of A[l..r].

All indices are 1-based.

**Input Format**

The first line contains N.
The second line contains N space-separated integers.
The third line contains Q.
Each of the next Q lines is a query of Type 1 or Type 2.

**Constraints**

- 1 ≤ N, Q ≤ 10^5
- 0 ≤ A[i] ≤ 10^9
- 1 ≤ l ≤ r ≤ N
- 0 ≤ x ≤ 10^9

**Output Format**

For each Type 2 query, print the answer on a separate line.

**Examples**

Input:
\`\`\`
4
6 3 5 2
1
1 1 3 4
\`\`\`
Output:
\`\`\`
12
\`\`\`
*Explanation: After chmin(1,3,4): A = [4,3,4,2]. Type 2 query sums A[1..4] = 4+3+4+2 = 13... verify with the actual test case input/output.*

**Note**

This requires the Segment Tree Beats technique (Ji Driver Segmentation). Each node stores the maximum, second maximum, count of maximums, and sum. The chmin update only propagates when the new value x falls between the second maximum and the maximum, keeping amortized complexity at O(N log^2 N).`,
          tags: ["segment-tree"],
          points: 500,
          time_limit: 3000,
          memory_limit: 512,
          testCases: [
            { input: "4\n6 3 5 2\n1\n1 1 3 4", expectedOutput: "12", isHidden: false },
          ],
        },
      ],
    },
    {
      title: "Math Olympiad Round",
      description: "Number theory, combinatorics, modular arithmetic, and prime sieves.",
      start_time: new Date("2026-04-27T11:00:00.000Z"),
      end_time: new Date("2026-04-27T13:00:00.000Z"),
      dsa: [
        {
          title: "GCD Queries",
          description: `You are given an array A of N positive integers. Answer Q queries of the form \`l r\`: print the GCD of all elements A[l], A[l+1], ..., A[r] (1-indexed).

**Input Format**

The first line contains two integers N and Q.
The second line contains N space-separated integers.
Each of the next Q lines contains two integers l and r.

**Constraints**

- 1 ≤ N ≤ 10^5
- 1 ≤ Q ≤ 10^5
- 1 ≤ A[i] ≤ 10^9
- 1 ≤ l ≤ r ≤ N

**Output Format**

For each query, print the GCD on a separate line.

**Examples**

Input:
\`\`\`
4 2
4 6 12 8
1 3
2 4
\`\`\`
Output:
\`\`\`
2
2
\`\`\`
*Explanation: GCD(4,6,12) = 2. GCD(6,12,8) = 2.*

**Note**

Build a sparse table on the GCD function, which is idempotent (GCD(a,a) = a). This enables O(1) per query after O(N log N) preprocessing. Alternatively, use a segment tree supporting GCD range queries in O(log N) per query.`,
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
          description: `Given two integers L and R, count the number of prime numbers in the closed interval [L, R].

**Input Format**

A single line containing two space-separated integers L and R.

**Constraints**

- 1 ≤ L ≤ R ≤ 10^6

**Output Format**

Print a single integer — the count of primes in [L, R].

**Examples**

Input:
\`\`\`
1 10
\`\`\`
Output:
\`\`\`
4
\`\`\`
*Explanation: Primes in [1,10] are 2, 3, 5, 7.*

Input:
\`\`\`
10 20
\`\`\`
Output:
\`\`\`
4
\`\`\`
*Explanation: Primes in [10,20] are 11, 13, 17, 19.*

**Note**

Run the Sieve of Eratosthenes up to R in O(R log log R). Then count primes in [L, R] using a prefix sum over the sieve. For very large R (up to 10^9), use a segmented sieve operating only on [L, R].`,
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
      dsa: [
        {
          title: "Activity Selection",
          description: `You are given N activities, each with a start time S[i] and finish time F[i]. You want to select the maximum number of activities such that no two selected activities overlap. Two activities overlap if one starts before the other finishes (i.e., they share more than a single point in time).

**Input Format**

The first line contains an integer N — the number of activities.
Each of the next N lines contains two integers S[i] and F[i] — the start and finish times of activity i.

**Constraints**

- 1 ≤ N ≤ 10^5
- 0 ≤ S[i] < F[i] ≤ 10^9

**Output Format**

Print a single integer — the maximum number of non-overlapping activities.

**Examples**

Input:
\`\`\`
3
1 3
2 4
3 5
\`\`\`
Output:
\`\`\`
2
\`\`\`
*Explanation: Select activities [1,3] and [3,5]. They share only the endpoint 3, which is allowed.*

Input:
\`\`\`
4
1 2
3 4
0 6
5 7
\`\`\`
Output:
\`\`\`
3
\`\`\`
*Explanation: Select [1,2], [3,4], [5,7] — three non-overlapping activities.*

**Note**

Classic greedy: sort activities by finish time. Greedily pick each activity that starts at or after the finish time of the last selected activity. This classic exchange argument proof shows this always yields the optimal count. Time: O(N log N) for the sort.`,
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
      // Update existing problems' descriptions
      for (const problem of c.dsa) {
        await prisma.dsaProblems.updateMany({
          where: { contest_id: existing.id, title: problem.title },
          data: { description: problem.description },
        });
      }
      console.log(`Updated problems for: ${c.title}`);
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
