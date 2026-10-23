import { PracticeProblem } from './practice-problems';

export const LOW_LEVEL_DESIGN_PROBLEMS: PracticeProblem[] = [
  {
    id: 'design-parking-lot-system',
    slug: 'design-parking-lot-system',
    title: 'Design Parking Lot System',
    difficulty: 'Medium',
    category: 'Object-Oriented Design & Patterns',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/design-parking-system/',
    topics: ['Object-Oriented Design', 'LLD', 'State Pattern'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Uber'],
    description: `Design an object-oriented Parking Lot System.

The parking lot has multiple spot types:
- **Big** (type 1)
- **Medium** (type 2)
- **Small** (type 3)

Implement the \`ParkingSystem\` class:
- \`ParkingSystem(int big, int medium, int small)\`: Initializes object of the \`ParkingSystem\` class with number of available spots for each parking size.
- \`bool addCar(int carType)\`: Checks whether there is a parking spot of \`carType\` (1 for big, 2 for medium, 3 for small) for the incoming car. If yes, it parks the car and returns \`true\`; otherwise returns \`false\`.`,
    note: 'In advanced LLD interviews, be prepared to discuss pricing strategies, multi-floor routing, and ticket generation.',
    examples: [
      {
        id: 1,
        input: '["ParkingSystem", "addCar", "addCar", "addCar", "addCar"]\n[[1, 1, 0], [1], [2], [3], [1]]',
        output: '[null, true, true, false, false]',
        explanation: 'Parks 1 big car (true), 1 medium car (true), fails to park small car (false, no slots), fails to park 2nd big car (false, full).',
      },
    ],
    constraints: [
      '0 <= big, medium, small <= 1000',
      'carType is 1, 2, or 3',
      'At most 1000 calls will be made to addCar',
    ],
    starterCodes: {
      Java: `class ParkingSystem {
    private int big;
    private int medium;
    private int small;

    public ParkingSystem(int big, int medium, int small) {
        this.big = big;
        this.medium = medium;
        this.small = small;
    }
    
    public boolean addCar(int carType) {
        // Write your code here
        return false;
    }
}`,
      Python: `class ParkingSystem:
    def __init__(self, big: int, medium: int, small: int):
        self.spots = {1: big, 2: medium, 3: small}

    def addCar(self, carType: int) -> bool:
        # Write your code here
        pass`,
      'C++': `class ParkingSystem {
private:
    int b, m, s;
public:
    ParkingSystem(int big, int medium, int small) : b(big), m(medium), s(small) {}
    
    bool addCar(int carType) {
        // Write your code here
        return false;
    }
};`,
      JavaScript: `/**
 * @param {number} big
 * @param {number} medium
 * @param {number} small
 */
var ParkingSystem = function(big, medium, small) {
    this.spots = [0, big, medium, small];
};

/** 
 * @param {number} carType
 * @return {boolean}
 */
ParkingSystem.prototype.addCar = function(carType) {
    // Write your code here
};`,
      TypeScript: `class ParkingSystem {
    private spots: number[];
    constructor(big: number, medium: number, small: number) {
        this.spots = [0, big, medium, small];
    }

    addCar(carType: number): boolean {
        // Write your code here
        return false;
    }
}`,
    },
    solutionCode: {
      Java: `class ParkingSystem {
    private int big;
    private int medium;
    private int small;

    public ParkingSystem(int big, int medium, int small) {
        this.big = big;
        this.medium = medium;
        this.small = small;
    }
    
    public boolean addCar(int carType) {
        if (carType == 1 && big > 0) {
            big--;
            return true;
        } else if (carType == 2 && medium > 0) {
            medium--;
            return true;
        } else if (carType == 3 && small > 0) {
            small--;
            return true;
        }
        return false;
    }
}`,
      Python: `class ParkingSystem:
    def __init__(self, big: int, medium: int, small: int):
        self.spots = {1: big, 2: medium, 3: small}

    def addCar(self, carType: int) -> bool:
        if self.spots[carType] > 0:
            self.spots[carType] -= 1
            return True
        return False`,
      'C++': `class ParkingSystem {
private:
    int b, m, s;
public:
    ParkingSystem(int big, int medium, int small) : b(big), m(medium), s(small) {}
    
    bool addCar(int carType) {
        if (carType == 1 && b > 0) { b--; return true; }
        if (carType == 2 && m > 0) { m--; return true; }
        if (carType == 3 && s > 0) { s--; return true; }
        return false;
    }
};`,
      JavaScript: `var ParkingSystem = function(big, medium, small) {
    this.spots = [0, big, medium, small];
};

ParkingSystem.prototype.addCar = function(carType) {
    if (this.spots[carType] > 0) {
        this.spots[carType]--;
        return true;
    }
    return false;
};`,
    },
  },
  {
    id: 'design-lru-cache-with-ttl',
    slug: 'design-lru-cache-with-ttl',
    title: 'Design LRU Cache with TTL',
    difficulty: 'Medium',
    category: 'Object-Oriented Design & Patterns',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/lru-cache/',
    topics: ['LLD', 'Cache', 'Doubly Linked List'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Bloomberg'],
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache** with entry expiration (**Time-To-Live**).

Implement the \`LRUCacheWithTTL\` class:
- \`LRUCacheWithTTL(int capacity)\`: Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key, int currentTime)\`: Return the value of the \`key\` if the key exists and has not expired (\`currentTime <= expiryTime\`). Otherwise, return \`-1\`. Accessing an active key refreshes its recency.
- \`void put(int key, int value, int ttl, int currentTime)\`: Update or insert the \`value\` with expiration \`currentTime + ttl\`. If the number of keys exceeds \`capacity\`, evict the least recently used key.`,
    note: 'Expired items should be treated as non-existent. Both get and put should operate in O(1) average time.',
    examples: [
      {
        id: 1,
        input: 'put(1, 10, ttl=5, t=0), get(1, t=3), get(1, t=6)',
        output: '[10, -1]',
        explanation: 'At t=3, item 1 has not expired (expiry is 5), returns 10. At t=6, item has expired, returns -1.',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      '1 <= ttl <= 10^5',
    ],
    starterCodes: {
      Java: `import java.util.*;

class LRUCacheWithTTL {
    public LRUCacheWithTTL(int capacity) {
        // Write your code here
    }
    
    public int get(int key, int currentTime) {
        // Write your code here
        return -1;
    }
    
    public void put(int key, int value, int ttl, int currentTime) {
        // Write your code here
    }
}`,
      Python: `class LRUCacheWithTTL:
    def __init__(self, capacity: int):
        self.capacity = capacity

    def get(self, key: int, current_time: int) -> int:
        # Write your code here
        return -1

    def put(self, key: int, value: int, ttl: int, current_time: int) -> None:
        # Write your code here
        pass`,
      'C++': `class LRUCacheWithTTL {
public:
    LRUCacheWithTTL(int capacity) {}
    int get(int key, int currentTime) { return -1; }
    void put(int key, int value, int ttl, int currentTime) {}
};`,
      JavaScript: `var LRUCacheWithTTL = function(capacity) {};
LRUCacheWithTTL.prototype.get = function(key, currentTime) { return -1; };
LRUCacheWithTTL.prototype.put = function(key, value, ttl, currentTime) {};`,
      TypeScript: `class LRUCacheWithTTL {
    constructor(capacity: number) {}
    get(key: number, currentTime: number): number { return -1; }
    put(key: number, value: number, ttl: number, currentTime: number): void {}
}`,
    },
    solutionCode: {
      Java: `import java.util.*;

class LRUCacheWithTTL {
    class Node {
        int key, val, expiry;
        Node prev, next;
        Node(int k, int v, int exp) { key = k; val = v; expiry = exp; }
    }
    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0, 0);
    private final Node tail = new Node(0, 0, 0);

    public LRUCacheWithTTL(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insertToFront(Node node) {
        node.next = head.next;
        node.next.prev = node;
        head.next = node;
        node.prev = head;
    }
    
    public int get(int key, int currentTime) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        if (currentTime > node.expiry) {
            remove(node);
            map.remove(key);
            return -1;
        }
        remove(node);
        insertToFront(node);
        return node.val;
    }
    
    public void put(int key, int value, int ttl, int currentTime) {
        if (map.containsKey(key)) {
            remove(map.get(key));
        } else if (map.size() >= capacity) {
            Node lru = tail.prev;
            remove(lru);
            map.remove(lru.key);
        }
        Node node = new Node(key, value, currentTime + ttl);
        insertToFront(node);
        map.put(key, node);
    }
}`,
      Python: `class LRUCacheWithTTL:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}

    def get(self, key: int, current_time: int) -> int:
        if key not in self.cache:
            return -1
        val, expiry = self.cache[key]
        if current_time > expiry:
            del self.cache[key]
            return -1
        del self.cache[key]
        self.cache[key] = (val, expiry)
        return val

    def put(self, key: int, value: int, ttl: int, current_time: int) -> None:
        if key in self.cache:
            del self.cache[key]
        elif len(self.cache) >= self.capacity:
            oldest = next(iter(self.cache))
            del self.cache[oldest]
        self.cache[key] = (value, current_time + ttl)`,
      'C++': `class LRUCacheWithTTL {
    using Entry = tuple<int, int, int>;
    int capacity;
    list<Entry> entries;
    unordered_map<int, list<Entry>::iterator> index;
public:
    explicit LRUCacheWithTTL(int capacity) : capacity(capacity) {}
    int get(int key, int currentTime) {
        auto found = index.find(key);
        if (found == index.end()) return -1;
        auto [entryKey, value, expiry] = *found->second;
        if (currentTime > expiry) { entries.erase(found->second); index.erase(found); return -1; }
        entries.splice(entries.begin(), entries, found->second);
        return value;
    }
    void put(int key, int value, int ttl, int currentTime) {
        auto found = index.find(key);
        if (found != index.end()) { entries.erase(found->second); index.erase(found); }
        else if (capacity <= 0) return;
        else if ((int)entries.size() >= capacity) { index.erase(std::get<0>(entries.back())); entries.pop_back(); }
        entries.emplace_front(key, value, currentTime + ttl); index[key] = entries.begin();
    }
};`,
      JavaScript: `class LRUCacheWithTTL {
    constructor(capacity) { this.capacity = capacity; this.cache = new Map(); }
    get(key, currentTime) {
        if (!this.cache.has(key)) return -1;
        const [value, expiry] = this.cache.get(key);
        if (currentTime > expiry) { this.cache.delete(key); return -1; }
        this.cache.delete(key); this.cache.set(key, [value, expiry]); return value;
    }
    put(key, value, ttl, currentTime) {
        if (this.cache.has(key)) this.cache.delete(key);
        else if (this.capacity <= 0) return;
        else if (this.cache.size >= this.capacity) this.cache.delete(this.cache.keys().next().value);
        this.cache.set(key, [value, currentTime + ttl]);
    }
}`,
    },
  },
  {
    id: 'design-snake-and-ladder-game',
    slug: 'design-snake-and-ladder-game',
    title: 'Design Snake and Ladder Game',
    difficulty: 'Medium',
    category: 'Object-Oriented Design & Patterns',
    frequency: 4,
    leetcodeUrl: 'https://leetcode.com/problems/snakes-and-ladders/',
    topics: ['Object-Oriented Design', 'Game Design', 'Simulation'],
    companies: ['Amazon', 'Microsoft', 'Flipkart'],
    description: `Design an object-oriented simulation of the classic board game **Snake and Ladder**.

Game rules:
- The board has $N = 100$ cells numbered $1$ to $100$.
- Players start off the board (position 0) and roll a 6-sided die ($1$ to $6$).
- Landing on the bottom of a **ladder** advances the player immediately to the top of the ladder.
- Landing on the head of a **snake** slides the player immediately down to the snake's tail.
- A player wins when they land exactly on cell $100$. Overshooting cell 100 keeps the player at their current square.`,
    note: 'Demonstrate clean Separation of Concerns: Board, Player, Dice, and GameEngine entities.',
    examples: [
      {
        id: 1,
        input: 'snakes = {16: 6, 47: 26}, ladders = {2: 38, 9: 31}, moves = [2, 5]',
        output: 'Player moves from 0 -> (roll 2 lands on 2, climbs ladder to 38) -> (roll 5 moves to 43)',
      },
    ],
    constraints: ['1 <= players <= 6', 'Dice roll 1..6'],
    starterCodes: {
      Java: `import java.util.*;

class SnakeAndLadderGame {
    private final Map<Integer, Integer> jumpMap = new HashMap<>();

    public SnakeAndLadderGame(int[][] snakes, int[][] ladders) {
        // Write your code here
    }

    public int playTurn(int currentPos, int diceRoll) {
        // Return new position after roll and any snakes/ladders
        return currentPos;
    }
}`,
      Python: `class SnakeAndLadderGame:
    def __init__(self, snakes: list[list[int]], ladders: list[list[int]]):
        self.jumps = {}
        for start, end in snakes + ladders:
            self.jumps[start] = end

    def play_turn(self, current_pos: int, dice_roll: int) -> int:
        # Write your code here
        pass`,
      'C++': `class SnakeAndLadderGame {
public:
    SnakeAndLadderGame(vector<vector<int>>& snakes, vector<vector<int>>& ladders) {}
    int playTurn(int currentPos, int diceRoll) { return currentPos; }
};`,
      JavaScript: `class SnakeAndLadderGame {}`,
      TypeScript: `class SnakeAndLadderGame {}`,
    },
    solutionCode: {
      Java: `import java.util.*;

class SnakeAndLadderGame {
    private final Map<Integer, Integer> jumpMap = new HashMap<>();

    public SnakeAndLadderGame(int[][] snakes, int[][] ladders) {
        for (int[] s : snakes) jumpMap.put(s[0], s[1]);
        for (int[] l : ladders) jumpMap.put(l[0], l[1]);
    }

    public int playTurn(int currentPos, int diceRoll) {
        int nextPos = currentPos + diceRoll;
        if (nextPos > 100) return currentPos;
        return jumpMap.getOrDefault(nextPos, nextPos);
    }
}`,
      Python: `class SnakeAndLadderGame:
    def __init__(self, snakes: list[list[int]], ladders: list[list[int]]):
        self.jumps = {}
        for start, end in snakes + ladders:
            self.jumps[start] = end

    def play_turn(self, current_pos: int, dice_roll: int) -> int:
        next_pos = current_pos + dice_roll
        if next_pos > 100:
            return current_pos
        return self.jumps.get(next_pos, next_pos)`,
      'C++': `class SnakeAndLadderGame {
    unordered_map<int, int> jumps;
public:
    SnakeAndLadderGame(vector<vector<int>>& snakes, vector<vector<int>>& ladders) {
        for (const auto& jump : snakes) jumps[jump[0]] = jump[1];
        for (const auto& jump : ladders) jumps[jump[0]] = jump[1];
    }
    int playTurn(int currentPos, int diceRoll) {
        int next = currentPos + diceRoll;
        if (next > 100) return currentPos;
        auto found = jumps.find(next);
        return found == jumps.end() ? next : found->second;
    }
};`,
      JavaScript: `class SnakeAndLadderGame {
    constructor(snakes, ladders) { this.jumps = new Map([...snakes, ...ladders].map(([from, to]) => [from, to])); }
    playTurn(currentPos, diceRoll) {
        const next = currentPos + diceRoll;
        if (next > 100) return currentPos;
        return this.jumps.get(next) ?? next;
    }
}`,
    },
  },
  {
    id: 'design-in-memory-file-system',
    slug: 'design-in-memory-file-system',
    title: 'Design In-Memory File System',
    difficulty: 'Hard',
    category: 'Object-Oriented Design & Patterns',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/design-in-memory-file-system/',
    topics: ['Object-Oriented Design', 'Trie', 'File System'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Baidu'],
    description: `Design a data structure that simulates an in-memory file system.

Implement the \`FileSystem\` class:
- \`FileSystem()\`: Initializes the object of the system with root \`"/"\`.
- \`List<String> ls(String path)\`: 
  - If \`path\` is a file path, returns a list that only contains this file's name.
  - If \`path\` is a directory path, returns the list of file and directory names in this directory in **lexicographical order**.
- \`void mkdir(String path)\`: Makes a new directory according to the given path. If intermediate directories in the path do not exist, you should create them as well.
- \`void addContentToFile(String filePath, String content)\`: If \`filePath\` does not exist, creates that file containing given content. If \`filePath\` already exists, appends the given content to original content.
- \`String readContentFromFile(String filePath)\`: Returns the content in the file at \`filePath\`.`,
    note: 'Represent directory hierarchies using a Trie-like tree structure with map of children.',
    examples: [
      {
        id: 1,
        input: 'mkdir("/a/b/c"), addContentToFile("/a/b/c/d", "hello"), ls("/"), readContentFromFile("/a/b/c/d")',
        output: 'ls("/") -> ["a"], readContentFromFile -> "hello"',
      },
    ],
    constraints: ['1 <= path.length <= 100', 'Path starts with "/" and does not contain consecutive "//".'],
    starterCodes: {
      Java: `import java.util.*;

class FileSystem {
    public FileSystem() {
        // Write your code here
    }
    
    public List<String> ls(String path) {
        return new ArrayList<>();
    }
    
    public void mkdir(String path) {
    }
    
    public void addContentToFile(String filePath, String content) {
    }
    
    public String readContentFromFile(String filePath) {
        return "";
    }
}`,
      Python: `class FileSystem:
    def __init__(self):
        pass

    def ls(self, path: str) -> list[str]:
        return []

    def mkdir(self, path: str) -> None:
        pass

    def addContentToFile(self, filePath: str, content: str) -> None:
        pass

    def readContentFromFile(self, filePath: str) -> str:
        return ""`,
      'C++': `class FileSystem {
public:
    FileSystem() {}
    vector<string> ls(string path) { return {}; }
    void mkdir(string path) {}
    void addContentToFile(string filePath, string content) {}
    string readContentFromFile(string filePath) { return ""; }
};`,
      JavaScript: `class FileSystem {}`,
      TypeScript: `class FileSystem {}`,
    },
    solutionCode: {
      Java: `import java.util.*;

class FileSystem {
    class FileNode {
        boolean isFile = false;
        Map<String, FileNode> children = new HashMap<>();
        StringBuilder content = new StringBuilder();
    }
    private final FileNode root = new FileNode();

    public FileSystem() {}
    
    public List<String> ls(String path) {
        FileNode curr = root;
        List<String> res = new ArrayList<>();
        if (!path.equals("/")) {
            String[] parts = path.split("/");
            for (int i = 1; i < parts.length; i++) {
                curr = curr.children.get(parts[i]);
            }
            if (curr.isFile) {
                res.add(parts[parts.length - 1]);
                return res;
            }
        }
        res.addAll(curr.children.keySet());
        Collections.sort(res);
        return res;
    }
    
    public void mkdir(String path) {
        FileNode curr = root;
        String[] parts = path.split("/");
        for (int i = 1; i < parts.length; i++) {
            curr.children.putIfAbsent(parts[i], new FileNode());
            curr = curr.children.get(parts[i]);
        }
    }
    
    public void addContentToFile(String filePath, String content) {
        FileNode curr = root;
        String[] parts = filePath.split("/");
        for (int i = 1; i < parts.length - 1; i++) {
            curr.children.putIfAbsent(parts[i], new FileNode());
            curr = curr.children.get(parts[i]);
        }
        String fileName = parts[parts.length - 1];
        curr.children.putIfAbsent(fileName, new FileNode());
        FileNode file = curr.children.get(fileName);
        file.isFile = true;
        file.content.append(content);
    }
    
    public String readContentFromFile(String filePath) {
        FileNode curr = root;
        String[] parts = filePath.split("/");
        for (int i = 1; i < parts.length; i++) {
            curr = curr.children.get(parts[i]);
        }
        return curr.content.toString();
    }
}`,
      Python: `class FileSystem:
    def __init__(self):
        self.root = {"_files": {}, "_content": None}

    def ls(self, path: str) -> list[str]:
        curr = self.root
        if path != "/":
            parts = path.strip("/").split("/")
            for p in parts:
                curr = curr["_files"][p]
            if curr["_content"] is not None:
                return [parts[-1]]
        return sorted(curr["_files"].keys())

    def mkdir(self, path: str) -> None:
        curr = self.root
        for p in path.strip("/").split("/"):
            if not p: continue
            if p not in curr["_files"]:
                curr["_files"][p] = {"_files": {}, "_content": None}
            curr = curr["_files"][p]

    def addContentToFile(self, filePath: str, content: str) -> None:
        curr = self.root
        parts = filePath.strip("/").split("/")
        for p in parts[:-1]:
            curr = curr["_files"][p]
        fn = parts[-1]
        if fn not in curr["_files"]:
            curr["_files"][fn] = {"_files": {}, "_content": ""}
        curr["_files"][fn]["_content"] += content

    def readContentFromFile(self, filePath: str) -> str:
        curr = self.root
        for p in filePath.strip("/").split("/"):
            curr = curr["_files"][p]
        return curr["_content"]`,
      'C++': `class FileSystem {
    struct Node { bool file = false; string content; map<string, unique_ptr<Node>> children; };
    Node root;
    vector<string> parts(const string& path) { vector<string> out; string part; stringstream stream(path); while (getline(stream, part, '/')) if (!part.empty()) out.push_back(part); return out; }
    Node* find(const string& path, bool create) { Node* node = &root; for (const auto& part : parts(path)) { if (create && !node->children.count(part)) node->children[part] = make_unique<Node>(); auto it = node->children.find(part); if (it == node->children.end()) return nullptr; node = it->second.get(); } return node; }
public:
    vector<string> ls(string path) { Node* node = find(path, false); vector<string> out; if (!node) return out; if (node->file) { auto names=parts(path); out.push_back(names.back()); } else for (const auto& child : node->children) out.push_back(child.first); return out; }
    void mkdir(string path) { find(path, true); }
    void addContentToFile(string path, string content) { auto names=parts(path); if(names.empty()) return; string parent="/"; for(size_t i=0;i+1<names.size();++i) parent += names[i]+"/"; Node* node=find(parent+names.back(),true); node->file=true; node->content+=content; }
    string readContentFromFile(string path) { Node* node=find(path,false); return node ? node->content : string(); }
};`,
      JavaScript: `class FileSystem {
    constructor() { this.root = { file: false, content: "", children: new Map() }; }
    parts(path) { return path.split("/").filter(Boolean); }
    find(path, create = false) { let node=this.root; for(const part of this.parts(path)) { if(create&&!node.children.has(part)) node.children.set(part,{file:false,content:"",children:new Map()}); node=node.children.get(part); if(!node)return null; } return node; }
    ls(path) { const node=this.find(path); if(!node)return []; if(node.file)return [this.parts(path).at(-1)]; return [...node.children.keys()].sort(); }
    mkdir(path) { this.find(path,true); }
    addContentToFile(path,content) { const parts=this.parts(path); const name=parts.pop(); const node=this.find("/"+parts.join("/"),true); if(!node.children.has(name))node.children.set(name,{file:true,content:"",children:new Map()}); const file=node.children.get(name); file.file=true; file.content+=content; }
    readContentFromFile(path) { return this.find(path)?.content ?? ""; }
}`,
    },
  },
  {
    id: 'design-notification-service',
    slug: 'design-notification-service',
    title: 'Design Notification Service (Observer Pattern)',
    difficulty: 'Medium',
    category: 'Object-Oriented Design & Patterns',
    frequency: 4,
    leetcodeUrl: 'https://leetcode.com/discuss/interview-question/low-level-design',
    topics: ['Design Patterns', 'Observer', 'Pub-Sub'],
    companies: ['Uber', 'Meta', 'Netflix', 'Airbnb'],
    description: `Implement an event-driven **Notification Service** using the **Observer Pattern**.

The service allows:
- Multiple subscribers (Email, SMS, Push) to listen for specific event types (e.g. \`ORDER_PLACED\`, \`PAYMENT_FAILED\`).
- \`subscribe(eventType, channel)\`: Registers a channel for notifications.
- \`unsubscribe(eventType, channel)\`: Removes registration.
- \`notify(eventType, message)\`: Dispatches message to all subscribed channels in the order they were registered.`,
    note: 'Use Observer / Pub-Sub pattern with loosely coupled notification channels.',
    examples: [
      {
        id: 1,
        input: 'subscribe("ORDER", "Email"), subscribe("ORDER", "SMS"), notify("ORDER", "Order #123 confirmed")',
        output: '["[Email] Order #123 confirmed", "[SMS] Order #123 confirmed"]',
      },
    ],
    constraints: ['Channels and event types are strings with length <= 50.'],
    starterCodes: {
      Java: `import java.util.*;

class NotificationService {
    public void subscribe(String eventType, String channel) {}
    public void unsubscribe(String eventType, String channel) {}
    public List<String> notify(String eventType, String message) {
        return new ArrayList<>();
    }
}`,
      Python: `class NotificationService:
    def __init__(self):
        self.subscribers = {}

    def subscribe(self, event_type: str, channel: str):
        pass

    def unsubscribe(self, event_type: str, channel: str):
        pass

    def notify(self, event_type: str, message: str) -> list[str]:
        return []`,
      'C++': `class NotificationService {};`,
      JavaScript: `class NotificationService {}`,
      TypeScript: `class NotificationService {}`,
    },
    solutionCode: {
      Java: `import java.util.*;

class NotificationService {
    private final Map<String, List<String>> subscribers = new HashMap<>();

    public void subscribe(String eventType, String channel) {
        subscribers.computeIfAbsent(eventType, k -> new ArrayList<>()).add(channel);
    }

    public void unsubscribe(String eventType, String channel) {
        if (subscribers.containsKey(eventType)) {
            subscribers.get(eventType).remove(channel);
        }
    }

    public List<String> notify(String eventType, String message) {
        List<String> res = new ArrayList<>();
        if (subscribers.containsKey(eventType)) {
            for (String channel : subscribers.get(eventType)) {
                res.add("[" + channel + "] " + message);
            }
        }
        return res;
    }
}`,
      Python: `class NotificationService:
    def __init__(self):
        self.subscribers = {}

    def subscribe(self, event_type: str, channel: str):
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(channel)

    def unsubscribe(self, event_type: str, channel: str):
        if event_type in self.subscribers and channel in self.subscribers[event_type]:
            self.subscribers[event_type].remove(channel)

    def notify(self, event_type: str, message: str) -> list[str]:
        res = []
        for ch in self.subscribers.get(event_type, []):
            res.append(f"[{ch}] {message}")
        return res`,
      'C++': `class NotificationService {
    unordered_map<string, vector<string>> subscribers;
public:
    void subscribe(string eventType, string channel) { subscribers[eventType].push_back(channel); }
    void unsubscribe(string eventType, string channel) { auto& channels=subscribers[eventType]; auto it=find(channels.begin(),channels.end(),channel); if(it!=channels.end())channels.erase(it); }
    vector<string> notify(string eventType, string message) { vector<string> out; for(const auto& channel:subscribers[eventType])out.push_back("["+channel+"] "+message); return out; }
};`,
      JavaScript: `class NotificationService {
    constructor() { this.subscribers = new Map(); }
    subscribe(eventType, channel) { if(!this.subscribers.has(eventType))this.subscribers.set(eventType,[]); this.subscribers.get(eventType).push(channel); }
    unsubscribe(eventType, channel) { const list=this.subscribers.get(eventType)||[]; const i=list.indexOf(channel); if(i>=0)list.splice(i,1); }
    notify(eventType, message) { return (this.subscribers.get(eventType)||[]).map((channel)=>"["+channel+"] "+message); }
}`,
    },
  },
  {
    id: 'design-tic-tac-toe',
    slug: 'design-tic-tac-toe',
    title: 'Design Tic-Tac-Toe Game',
    difficulty: 'Easy',
    category: 'Object-Oriented Design & Patterns',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/design-tic-tac-toe/',
    topics: ['Object-Oriented Design', 'Game Design', 'Matrix'],
    companies: ['Google', 'Microsoft', 'Amazon', 'Apple'],
    description: `Assume the following rules are in place for a $n \\times n$ Tic-Tac-Toe game between two players:
1. A move is guaranteed to be valid and placed on an empty space.
2. Once a winning condition is reached, no more moves will be played.
3. A player who succeeds in placing $n$ of their marks in a horizontal, vertical, or diagonal row wins the game.

Implement the \`TicTacToe\` class:
- \`TicTacToe(int n)\`: Initializes the object the size of the board $n$.
- \`int move(int row, int col, int player)\`: Indicates that \`player\` with ID (1 or 2) makes a move at cell \`(row, col)\`. The move is guaranteed to be valid. The function returns:
  - \`0\` if no one wins yet.
  - \`1\` if player 1 wins.
  - \`2\` if player 2 wins.`,
    note: 'Optimize move detection to O(1) time complexity by maintaining row, column, and diagonal counters instead of checking the whole board.',
    examples: [
      {
        id: 1,
        input: 'TicTacToe(3), move(0, 0, 1), move(0, 2, 2), move(2, 2, 1), move(1, 1, 2), move(2, 0, 1), move(1, 0, 2), move(2, 1, 1)',
        output: 'Returns 1 (Player 1 wins on row 2)',
      },
    ],
    constraints: ['2 <= n <= 100', 'player is 1 or 2', '0 <= row, col < n'],
    starterCodes: {
      Java: `class TicTacToe {
    public TicTacToe(int n) {
        // Write your code here
    }
    
    public int move(int row, int col, int player) {
        // Write your code here
        return 0;
    }
}`,
      Python: `class TicTacToe:
    def __init__(self, n: int):
        pass

    def move(self, row: int, col: int, player: int) -> int:
        return 0`,
      'C++': `class TicTacToe {
public:
    TicTacToe(int n) {}
    int move(int row, int col, int player) { return 0; }
};`,
      JavaScript: `class TicTacToe {}`,
      TypeScript: `class TicTacToe {}`,
    },
    solutionCode: {
      Java: `class TicTacToe {
    private final int[] rows;
    private final int[] cols;
    private int diagonal = 0;
    private int antiDiagonal = 0;
    private final int n;

    public TicTacToe(int n) {
        this.n = n;
        this.rows = new int[n];
        this.cols = new int[n];
    }
    
    public int move(int row, int col, int player) {
        int toAdd = (player == 1) ? 1 : -1;
        rows[row] += toAdd;
        cols[col] += toAdd;
        if (row == col) diagonal += toAdd;
        if (col == (n - row - 1)) antiDiagonal += toAdd;
        
        if (Math.abs(rows[row]) == n ||
            Math.abs(cols[col]) == n ||
            Math.abs(diagonal) == n ||
            Math.abs(antiDiagonal) == n) {
            return player;
        }
        return 0;
    }
}`,
      Python: `class TicTacToe:
    def __init__(self, n: int):
        self.n = n
        self.rows = [0] * n
        self.cols = [0] * n
        self.diag = 0
        self.anti_diag = 0

    def move(self, row: int, col: int, player: int) -> int:
        val = 1 if player == 1 else -1
        self.rows[row] += val
        self.cols[col] += val
        if row == col:
            self.diag += val
        if col == (self.n - row - 1):
            self.anti_diag += val

        if (abs(self.rows[row]) == self.n or
            abs(self.cols[col]) == self.n or
            abs(self.diag) == self.n or
            abs(self.anti_diag) == self.n):
            return player
        return 0`,
      'C++': `class TicTacToe {
    int n; vector<int> rows, cols; int diagonal=0, antiDiagonal=0;
public:
    explicit TicTacToe(int n) : n(n), rows(n), cols(n) {}
    int move(int row,int col,int player) { int value=player==1?1:-1; rows[row]+=value; cols[col]+=value; if(row==col)diagonal+=value; if(col==n-row-1)antiDiagonal+=value; if(abs(rows[row])==n||abs(cols[col])==n||abs(diagonal)==n||abs(antiDiagonal)==n)return player; return 0; }
};`,
      JavaScript: `class TicTacToe {
    constructor(n) { this.n=n; this.rows=Array(n).fill(0); this.cols=Array(n).fill(0); this.diagonal=0; this.antiDiagonal=0; }
    move(row,col,player) { const value=player===1?1:-1; this.rows[row]+=value; this.cols[col]+=value; if(row===col)this.diagonal+=value; if(col===this.n-row-1)this.antiDiagonal+=value; if(Math.abs(this.rows[row])===this.n||Math.abs(this.cols[col])===this.n||Math.abs(this.diagonal)===this.n||Math.abs(this.antiDiagonal)===this.n)return player; return 0; }
}`,
    },
  },
];
