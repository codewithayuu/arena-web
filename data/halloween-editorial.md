# 🎃 Hollow Hill Halloween Contest — Div 3 Editorial

## Problem A: Jack's Candy Bag
- **Concept:** Ad-hoc / Sorting / Hash Set
- **Time Complexity:** $\mathcal{O}(n \log n)$ or $\mathcal{O}(n)$
- **Space Complexity:** $\mathcal{O}(n)$
- **Explanation:**
  We are given an array of $n$ candy flavor codes and need to determine how many distinct flavor codes exist. We can either insert all elements into a hash set (`std::unordered_set` in C++) or sort the array and use `std::unique`. Sorting takes $\mathcal{O}(n \log n)$ time and $\mathcal{O}(1)$ auxiliary space, well within the 1.0 second limit for $n \le 2 \cdot 10^5$.

---

## Problem B: Ghosts Need Housing
- **Concept:** Greedy / Two Pointers / Sorting
- **Time Complexity:** $\mathcal{O}(n \log n + m \log m)$
- **Space Complexity:** $\mathcal{O}(n + m)$
- **Explanation:**
  Sort ghost preferences $a$ and house sizes $b$ in ascending order. Maintain two pointers: $i$ pointing to the smallest unmatched ghost, and $j$ pointing to the smallest available house.
  - If $b_j < a_i - k$, house $j$ is too small for ghost $i$. Since subsequent ghosts want even larger houses, house $j$ can never be used by any remaining ghost. Increment $j$.
  - If $b_j > a_i + k$, house $j$ is too large for ghost $i$. Since all remaining houses are $\ge b_j$, no house can satisfy ghost $i$. Increment $i$.
  - Otherwise, $a_i - k \le b_j \le a_i + k$. Ghost $i$ takes house $j$. Increment both $i$ and $j$, and increase the answer count.

---

## Problem C: The Cursed Queue
- **Concept:** Constructive Algorithms / Inversions / Greedy
- **Time Complexity:** $\mathcal{O}(n)$
- **Space Complexity:** $\mathcal{O}(n)$
- **Explanation:**
  We need a permutation of $1, 2, \dots, n$ with exactly $k$ inversions and the maximum possible prefix length $L$ such that $p_1 = 1, \dots, p_L = L$.
  Notice that keeping $p_1 = 1, \dots, p_L = L$ means the first $L$ elements cannot form any inversions (among themselves or with subsequent elements, because any subsequent element is $> L$).
  Therefore, all $k$ inversions must be created among the remaining $M = n - L$ elements.
  The maximum inversions in $M$ elements is $\frac{M(M-1)}{2}$. Thus, we find the minimal $M$ such that $\frac{M(M-1)}{2} \ge k$, which maximizes $L = n - M$.
  The remaining elements $\{L+1, \dots, n\}$ can be arranged greedily: repeatedly place the largest available element if $k$ is greater than or equal to the remaining slots, then place the specific element that contributes the exact remaining $k$ inversions, and place the rest in sorted order. This runs in $\mathcal{O}(n)$ time.

---

## Problem D: The Witch Market
- **Concept:** Dynamic Programming (0-1 Knapsack)
- **Time Complexity:** $\mathcal{O}(n \cdot x)$
- **Space Complexity:** $\mathcal{O}(x)$
- **Explanation:**
  This is the classic 0-1 Knapsack problem. We have $n$ items, each with cost $h_i$ and magic power $s_i$, with budget $x$.
  Let $dp[w]$ be the maximum magic power attainable with cost at most $w$.
  For each ingredient $i$:
  $$\text{for } w \text{ from } x \text{ down to } h_i: \quad dp[w] = \max(dp[w], dp[w - h_i] + s_i)$$
  With $n \le 1000$ and $x \le 10^5$, the number of iterations is at most $10^8$. In C++, a tight 1D loop of $10^8$ operations executes in less than 0.1 seconds.

---

## Problem E: The Graveyard Walk
- **Concept:** Trees / Graph Theory / Tree Diameter (2x BFS)
- **Time Complexity:** $\mathcal{O}(n)$
- **Space Complexity:** $\mathcal{O}(n)$
- **Explanation:**
  The graveyard forms a tree with $n$ nodes and $n-1$ undirected edges. We need to find the longest simple path between any two nodes (the diameter of the tree).
  We can compute this with two standard Breadth-First Searches (BFS):
  1. Run BFS from an arbitrary node (e.g. Node 1) to find the furthest node $u$.
  2. Run BFS from node $u$ to find the furthest node $v$.
  The distance between $u$ and $v$ is the diameter of the tree.

---

## Problem F: The Pumpkin Whisperer
- **Concept:** Two Pointers / Sliding Window / Median / Geometry
- **Time Complexity:** $\mathcal{O}(\sum n)$
- **Space Complexity:** $\mathcal{O}(n)$
- **Explanation:**
  We are given sorted pumpkin positions $a_1 < a_2 < \dots < a_n$. Jack needs to wake $k+1$ pumpkins with minimum radius $R$.
  A shouting radius $R$ wakes $k+1$ pumpkins if and only if there exists some contiguous subarray of $k+1$ pumpkins $a_i, a_{i+1}, \dots, a_{i+k}$ that can be covered by an interval of length $2R$.
  The smallest interval covering $a_i \dots a_{i+k}$ has length $a_{i+k} - a_i$. Standing at the midpoint $x = \lfloor \frac{a_i + a_{i+k}}{2} \rfloor$ achieves the minimum radius for this window.
  Therefore, we simply iterate through all $i$ from $0$ to $n - (k + 1)$, find the index $i$ that minimizes $(a_{i+k} - a_i)$, and output the midpoint $(a_i + a_{i+k}) / 2$.

---

## Problem G: Pip's Bedsheet Glider
- **Concept:** Monotonic Stack + Dynamic Programming + Segment Tree / Cartesian Tree
- **Time Complexity:** $\mathcal{O}(n \log n)$
- **Space Complexity:** $\mathcal{O}(n)$
- **Explanation:**
  Pip can glide from tower $a$ to tower $b$ if and only if $h_a > h_b$ and all intermediate towers have height strictly less than $h_a$.
  For each tower $u$, let $L[u]$ be the first tower to the left with $h_{L[u]} \ge h_u$, and $R[u]$ be the first tower to the right with $h_{R[u]} \ge h_u$.
  From tower $u$, Pip can glide to any tower $v \in [L[u]+1, R[u]-1] \setminus \{u\}$.
  Since every valid glide strictly decreases the height, the transition graph is a Directed Acyclic Graph (DAG).
  We can define $dp[u]$ as the maximum number of towers Pip can visit starting at tower $u$:
  $$dp[u] = 1 + \max_{v \in [L[u]+1, R[u]-1]} dp[v]$$
  We compute $L[u]$ and $R[u]$ in $\mathcal{O}(n)$ time using monotonic stacks. Then, we process towers in increasing order of height, querying the maximum $dp$ in range $[L[u]+1, R[u]-1]$ using a Segment Tree, and updating the segment tree with $dp[u]$.
  Handling equal heights by querying first and inserting in batches avoids invalid horizontal jumps.
  The total time complexity is $\mathcal{O}(n \log n)$.
