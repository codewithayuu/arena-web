import { PracticeProblem } from './practice-problems';

export const CONCURRENCY_PROBLEMS: PracticeProblem[] = [
  {
    id: 'print-foobar-alternately',
    slug: 'print-foobar-alternately',
    title: 'Print FooBar Alternately',
    difficulty: 'Medium',
    category: 'Thread Synchronization & Coordination',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/print-foobar-alternately/',
    topics: ['Concurrency', 'Synchronization', 'Multi-threading'],
    companies: ['Google', 'Microsoft', 'Amazon'],
    description: `Suppose you are given the following code:
\`\`\`java
class FooBar {
  public void foo() {
    for (int i = 0; i < n; i++) {
      print("foo");
    }
  }

  public void bar() {
    for (int i = 0; i < n; i++) {
      print("bar");
    }
  }
}
\`\`\`

The same instance of \`FooBar\` will be passed to two different threads:
- **Thread A** calls \`foo()\`.
- **Thread B** calls \`bar()\`.

Modify the program to ensure that **"foobar"** is printed $n$ times alternately.`,
    note: 'Ensure there are no race conditions, deadlocks, or busy-waiting CPU spikes.',
    examples: [
      {
        id: 1,
        input: 'n = 1',
        output: '"foobar"',
        explanation: 'There are two threads being run asynchronously. One prints "foo" and the other prints "bar". "foobar" is output 1 time.',
      },
      {
        id: 2,
        input: 'n = 2',
        output: '"foobarfoobar"',
        explanation: '"foobar" is output 2 times alternately.',
      },
    ],
    constraints: ['1 <= n <= 1000'],
    starterCodes: {
      Java: `import java.util.concurrent.Semaphore;

class FooBar {
    private int n;
    private Semaphore fooSem = new Semaphore(1);
    private Semaphore barSem = new Semaphore(0);

    public FooBar(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            fooSem.acquire();
            // printFoo.run() outputs "foo". Do not change or remove this line.
            printFoo.run();
            barSem.release();
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            barSem.acquire();
            // printBar.run() outputs "bar". Do not change or remove this line.
            printBar.run();
            fooSem.release();
        }
    }
}`,
      Python: `from threading import Semaphore

class FooBar:
    def __init__(self, n):
        self.n = n
        self.foo_sem = Semaphore(1)
        self.bar_sem = Semaphore(0)

    def foo(self, printFoo: 'Callable[[], None]') -> None:
        for i in range(self.n):
            self.foo_sem.acquire()
            printFoo()
            self.bar_sem.release()

    def bar(self, printBar: 'Callable[[], None]') -> None:
        for i in range(self.n):
            self.bar_sem.acquire()
            printBar()
            self.foo_sem.release()`,
      'C++': `#include <condition_variable>
#include <functional>
#include <mutex>

class FooBar {
private:
    int n;
    std::mutex mutex;
    std::condition_variable turnChanged;
    bool fooTurn = true;

public:
    FooBar(int n) {
        this->n = n;
    }

    void foo(std::function<void()> printFoo) {
        for (int i = 0; i < n; i++) {
            std::unique_lock<std::mutex> lock(mutex);
            turnChanged.wait(lock, [this] { return fooTurn; });
            printFoo();
            fooTurn = false;
            lock.unlock();
            turnChanged.notify_all();
        }
    }

    void bar(std::function<void()> printBar) {
        for (int i = 0; i < n; i++) {
            std::unique_lock<std::mutex> lock(mutex);
            turnChanged.wait(lock, [this] { return !fooTurn; });
            printBar();
            fooTurn = true;
            lock.unlock();
            turnChanged.notify_all();
        }
    }
};`,
      JavaScript: `class FooBar {
    constructor(n) {
        this.n = n;
    }

    async foo(printFoo) {
        for (let i = 0; i < this.n; i++) {
            printFoo();
        }
    }

    async bar(printBar) {
        for (let i = 0; i < this.n; i++) {
            printBar();
        }
    }
}`,
      TypeScript: `class FooBar {
    private n: number;

    constructor(n: number) {
        this.n = n;
    }

    async foo(printFoo: () => void): Promise<void> {
        for (let i = 0; i < this.n; i++) {
            printFoo();
        }
    }

    async bar(printBar: () => void): Promise<void> {
        for (let i = 0; i < this.n; i++) {
            printBar();
        }
    }
}`,
    },
    solutionCode: {
      Java: `import java.util.concurrent.Semaphore;

class FooBar {
    private int n;
    private Semaphore fooSem = new Semaphore(1);
    private Semaphore barSem = new Semaphore(0);

    public FooBar(int n) {
        this.n = n;
    }

    public void foo(Runnable printFoo) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            fooSem.acquire();
            printFoo.run();
            barSem.release();
        }
    }

    public void bar(Runnable printBar) throws InterruptedException {
        for (int i = 0; i < n; i++) {
            barSem.acquire();
            printBar.run();
            fooSem.release();
        }
    }
}`,
      Python: `from threading import Semaphore

class FooBar:
    def __init__(self, n):
        self.n = n
        self.foo_sem = Semaphore(1)
        self.bar_sem = Semaphore(0)

    def foo(self, printFoo: 'Callable[[], None]') -> None:
        for i in range(self.n):
            self.foo_sem.acquire()
            printFoo()
            self.bar_sem.release()

    def bar(self, printBar: 'Callable[[], None]') -> None:
        for i in range(self.n):
            self.bar_sem.acquire()
            printBar()
            self.foo_sem.release()`,
      'C++': `#include <condition_variable>
#include <functional>
#include <mutex>

class FooBar {
private:
    int n;
    std::mutex mutex;
    std::condition_variable turnChanged;
    bool fooTurn = true;

public:
    FooBar(int n) : n(n) {}

    void foo(std::function<void()> printFoo) {
        for (int i = 0; i < n; i++) {
            std::unique_lock<std::mutex> lock(mutex);
            turnChanged.wait(lock, [this] { return fooTurn; });
            printFoo();
            fooTurn = false;
            lock.unlock();
            turnChanged.notify_all();
        }
    }

    void bar(std::function<void()> printBar) {
        for (int i = 0; i < n; i++) {
            std::unique_lock<std::mutex> lock(mutex);
            turnChanged.wait(lock, [this] { return !fooTurn; });
            printBar();
            fooTurn = true;
            lock.unlock();
            turnChanged.notify_all();
        }
    }
};`,
      JavaScript: `class FooBar {
    constructor(n) {
        this.n = n;
        this.turn = "foo";
        this.waiters = [];
    }

    async run(expectedTurn, callback) {
        for (let i = 0; i < this.n; i++) {
            while (this.turn !== expectedTurn) {
                await new Promise((resolve) => this.waiters.push(resolve));
            }
            callback();
            this.turn = expectedTurn === "foo" ? "bar" : "foo";
            for (const wake of this.waiters.splice(0)) wake();
        }
    }

    async foo(printFoo) {
        return this.run("foo", printFoo);
    }

    async bar(printBar) {
        return this.run("bar", printBar);
    }
}`,
    },
  },
  {
    id: 'design-bounded-blocking-queue',
    slug: 'design-bounded-blocking-queue',
    title: 'Design Bounded Blocking Queue',
    difficulty: 'Medium',
    category: 'Thread Synchronization & Coordination',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/design-bounded-blocking-queue/',
    topics: ['Concurrency', 'Queue', 'Producer-Consumer'],
    companies: ['Google', 'Meta', 'Amazon', 'Bloomberg'],
    description: `Implement a thread-safe Bounded Blocking Queue that supports the following operations:
- \`BoundedBlockingQueue(int capacity)\`: Initializes the queue with the specified maximum capacity.
- \`void enqueue(int element)\`: Adds \`element\` to the front of the queue. If the queue is full, the calling thread blocks until the queue is no longer full.
- \`int dequeue()\`: Returns and removes the element at the rear of the queue. If the queue is empty, the calling thread blocks until the queue is no longer empty.
- \`int size()\`: Returns the current number of elements in the queue.

Your implementation must be thread-safe and handle multiple producer and consumer threads without race conditions or starvation.`,
    note: 'Use monitors, locks, or semaphores with condition variables for efficient signaling.',
    examples: [
      {
        id: 1,
        input: 'capacity = 2, operations: enqueue(1), enqueue(2), dequeue(), enqueue(3), size()',
        output: '[null, null, 1, null, 2]',
        explanation: 'Enqueues 1 and 2, dequeues 1 (leaving 2), enqueues 3 (queue now has 2, 3), size() returns 2.',
      },
    ],
    constraints: [
      '1 <= capacity <= 1000',
      'enqueue, dequeue, and size will be called concurrently by multiple threads.',
    ],
    starterCodes: {
      Java: `import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

class BoundedBlockingQueue {
    private final Queue<Integer> queue = new LinkedList<>();
    private final int capacity;
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    public BoundedBlockingQueue(int capacity) {
        this.capacity = capacity;
    }
    
    public void enqueue(int element) throws InterruptedException {
        // Write your code here
    }
    
    public int dequeue() throws InterruptedException {
        // Write your code here
        return -1;
    }
    
    public int size() {
        // Write your code here
        return 0;
    }
}`,
      Python: `from threading import Lock, Condition
from collections import deque

class BoundedBlockingQueue:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.queue = deque()
        self.lock = Lock()
        self.not_full = Condition(self.lock)
        self.not_empty = Condition(self.lock)

    def enqueue(self, element: int) -> None:
        # Write your code here
        pass

    def dequeue(self) -> int:
        # Write your code here
        pass

    def size(self) -> int:
        # Write your code here
        pass`,
      'C++': `#include <queue>
#include <mutex>
#include <condition_variable>

class BoundedBlockingQueue {
private:
    std::queue<int> q;
    int capacity;
    std::mutex mtx;
    std::condition_variable not_full;
    std::condition_variable not_empty;

public:
    BoundedBlockingQueue(int capacity) : capacity(capacity) {}
    
    void enqueue(int element) {
        // Write your code here
    }
    
    int dequeue() {
        // Write your code here
        return -1;
    }
    
    int size() {
        // Write your code here
        return 0;
    }
};`,
      JavaScript: `class BoundedBlockingQueue {
    constructor(capacity) {
        this.capacity = capacity;
        this.queue = [];
    }

    async enqueue(element) {
        // Wait for a slot, then add the element and wake one waiting consumer.
    }

    async dequeue() {
        // Wait for an element, remove it, and wake one waiting producer.
    }

    size() {
        // Return the current queue length.
        return 0;
    }
}`,
      TypeScript: `class BoundedBlockingQueue {
    private capacity: number;
    private queue: number[] = [];

    constructor(capacity: number) {
        this.capacity = capacity;
    }
}`,
    },
    solutionCode: {
      Java: `import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

class BoundedBlockingQueue {
    private final Queue<Integer> queue = new LinkedList<>();
    private final int capacity;
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    public BoundedBlockingQueue(int capacity) {
        this.capacity = capacity;
    }
    
    public void enqueue(int element) throws InterruptedException {
        lock.lock();
        try {
            while (queue.size() == capacity) {
                notFull.await();
            }
            queue.offer(element);
            notEmpty.signal();
        } finally {
            lock.unlock();
        }
    }
    
    public int dequeue() throws InterruptedException {
        lock.lock();
        try {
            while (queue.isEmpty()) {
                notEmpty.await();
            }
            int val = queue.poll();
            notFull.signal();
            return val;
        } finally {
            lock.unlock();
        }
    }
    
    public int size() {
        lock.lock();
        try {
            return queue.size();
        } finally {
            lock.unlock();
        }
    }
}`,
      Python: `from threading import Lock, Condition
from collections import deque

class BoundedBlockingQueue:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.queue = deque()
        self.lock = Lock()
        self.not_full = Condition(self.lock)
        self.not_empty = Condition(self.lock)

    def enqueue(self, element: int) -> None:
        with self.not_full:
            while len(self.queue) == self.capacity:
                self.not_full.wait()
            self.queue.append(element)
            self.not_empty.notify()

    def dequeue(self) -> int:
        with self.not_empty:
            while len(self.queue) == 0:
                self.not_empty.wait()
            val = self.queue.popleft()
            self.not_full.notify()
            return val

    def size(self) -> int:
        with self.lock:
            return len(self.queue)`,
      'C++': `#include <queue>
#include <mutex>
#include <condition_variable>

class BoundedBlockingQueue {
private:
    std::queue<int> q;
    int capacity;
    std::mutex mtx;
    std::condition_variable not_full;
    std::condition_variable not_empty;

public:
    BoundedBlockingQueue(int capacity) : capacity(capacity) {}
    
    void enqueue(int element) {
        std::unique_lock<std::mutex> lock(mtx);
        not_full.wait(lock, [this]() { return q.size() < capacity; });
        q.push(element);
        not_empty.notify_one();
    }
    
    int dequeue() {
        std::unique_lock<std::mutex> lock(mtx);
        not_empty.wait(lock, [this]() { return !q.empty(); });
        int val = q.front();
        q.pop();
        not_full.notify_one();
        return val;
    }
    
    int size() {
        std::lock_guard<std::mutex> lock(mtx);
        return q.size();
    }
};`,
      JavaScript: `class BoundedBlockingQueue {
    constructor(capacity) {
        this.capacity = capacity;
        this.queue = [];
        this.notEmpty = [];
        this.notFull = [];
    }

    async enqueue(element) {
        while (this.queue.length >= this.capacity) {
            await new Promise((resolve) => this.notFull.push(resolve));
        }
        this.queue.push(element);
        for (const wake of this.notEmpty.splice(0)) wake();
    }

    async dequeue() {
        while (this.queue.length === 0) {
            await new Promise((resolve) => this.notEmpty.push(resolve));
        }
        const value = this.queue.shift();
        for (const wake of this.notFull.splice(0)) wake();
        return value;
    }

    size() {
        return this.queue.length;
    }
}`,
    },
  },
  {
    id: 'zero-even-odd',
    slug: 'zero-even-odd',
    title: 'Zero Even Odd',
    difficulty: 'Medium',
    category: 'Thread Synchronization & Coordination',
    frequency: 4,
    leetcodeUrl: 'https://leetcode.com/problems/print-zero-even-odd/',
    topics: ['Concurrency', 'Semaphores', 'Thread Coordination'],
    companies: ['Google', 'Adobe', 'Amazon'],
    description: `You are given an instance of the class \`ZeroEvenOdd\`. Three threads will call:
- \`zero()\`: prints 0.
- \`even()\`: prints even numbers ($2, 4, 6, \\dots$).
- \`odd()\`: prints odd numbers ($1, 3, 5, \\dots$).

The threads must be synchronized such that the sequence output is:
$$0102030405\\dots0n$$`,
    note: 'Output alternate 0s followed by consecutive natural numbers up to n.',
    examples: [
      {
        id: 1,
        input: 'n = 2',
        output: '"0102"',
        explanation: 'Three threads output "0102".',
      },
      {
        id: 2,
        input: 'n = 5',
        output: '"0102030405"',
      },
    ],
    constraints: ['1 <= n <= 1000'],
    starterCodes: {
      Java: `import java.util.concurrent.Semaphore;
import java.util.function.IntConsumer;

class ZeroEvenOdd {
    private int n;
    private Semaphore zeroSem = new Semaphore(1);
    private Semaphore evenSem = new Semaphore(0);
    private Semaphore oddSem = new Semaphore(0);
    
    public ZeroEvenOdd(int n) {
        this.n = n;
    }

    public void zero(IntConsumer printNumber) throws InterruptedException {
        // Write your code here
    }

    public void even(IntConsumer printNumber) throws InterruptedException {
        // Write your code here
    }

    public void odd(IntConsumer printNumber) throws InterruptedException {
        // Write your code here
    }
}`,
      Python: `from threading import Semaphore

class ZeroEvenOdd:
    def __init__(self, n):
        self.n = n
        self.zero_sem = Semaphore(1)
        self.even_sem = Semaphore(0)
        self.odd_sem = Semaphore(0)
        
    def zero(self, printNumber: 'Callable[[int], None]') -> None:
        pass
        
    def even(self, printNumber: 'Callable[[int], None]') -> None:
        pass
        
    def odd(self, printNumber: 'Callable[[int], None]') -> None:
        pass`,
      'C++': `#include <condition_variable>
#include <functional>
#include <mutex>

class ZeroEvenOdd {
private:
    int n;
    int next = 1;
    bool zeroTurn = true;
    std::mutex mutex;
    std::condition_variable turnChanged;

public:
    ZeroEvenOdd(int n) : n(n) {}

    void zero(std::function<void(int)> printNumber) {
        // Write your code here
    }

    void even(std::function<void(int)> printNumber) {
        // Write your code here
    }

    void odd(std::function<void(int)> printNumber) {
        // Write your code here
    }
};`,
      JavaScript: `class ZeroEvenOdd {
    constructor(n) {
        this.n = n;
    }
}`,
      TypeScript: `class ZeroEvenOdd {
    private n: number;
    constructor(n: number) {
        this.n = n;
    }
}`,
    },
    solutionCode: {
      Java: `import java.util.concurrent.Semaphore;
import java.util.function.IntConsumer;

class ZeroEvenOdd {
    private int n;
    private Semaphore zeroSem = new Semaphore(1);
    private Semaphore evenSem = new Semaphore(0);
    private Semaphore oddSem = new Semaphore(0);
    
    public ZeroEvenOdd(int n) {
        this.n = n;
    }

    public void zero(IntConsumer printNumber) throws InterruptedException {
        for (int i = 1; i <= n; i++) {
            zeroSem.acquire();
            printNumber.accept(0);
            if (i % 2 == 1) {
                oddSem.release();
            } else {
                evenSem.release();
            }
        }
    }

    public void even(IntConsumer printNumber) throws InterruptedException {
        for (int i = 2; i <= n; i += 2) {
            evenSem.acquire();
            printNumber.accept(i);
            zeroSem.release();
        }
    }

    public void odd(IntConsumer printNumber) throws InterruptedException {
        for (int i = 1; i <= n; i += 2) {
            oddSem.acquire();
            printNumber.accept(i);
            zeroSem.release();
        }
    }
}`,
      Python: `from threading import Semaphore

class ZeroEvenOdd:
    def __init__(self, n):
        self.n = n
        self.zero_sem = Semaphore(1)
        self.even_sem = Semaphore(0)
        self.odd_sem = Semaphore(0)
        
    def zero(self, printNumber: 'Callable[[int], None]') -> None:
        for i in range(1, self.n + 1):
            self.zero_sem.acquire()
            printNumber(0)
            if i % 2 == 1:
                self.odd_sem.release()
            else:
                self.even_sem.release()
        
    def even(self, printNumber: 'Callable[[int], None]') -> None:
        for i in range(2, self.n + 1, 2):
            self.even_sem.acquire()
            printNumber(i)
            self.zero_sem.release()
        
    def odd(self, printNumber: 'Callable[[int], None]') -> None:
        for i in range(1, self.n + 1, 2):
            self.odd_sem.acquire()
            printNumber(i)
            self.zero_sem.release()`,
      'C++': `#include <condition_variable>
#include <functional>
#include <mutex>

class ZeroEvenOdd {
private:
    int n;
    int next = 1;
    bool zeroTurn = true;
    std::mutex mutex;
    std::condition_variable turnChanged;

public:
    ZeroEvenOdd(int n) : n(n) {}

    void zero(std::function<void(int)> printNumber) {
        for (int i = 1; i <= n; i++) {
            std::unique_lock<std::mutex> lock(mutex);
            turnChanged.wait(lock, [this, i] { return zeroTurn && next == i; });
            printNumber(0);
            zeroTurn = false;
            lock.unlock();
            turnChanged.notify_all();
        }
    }

    void even(std::function<void(int)> printNumber) {
        for (int i = 2; i <= n; i += 2) {
            std::unique_lock<std::mutex> lock(mutex);
            turnChanged.wait(lock, [this, i] { return !zeroTurn && next == i; });
            printNumber(i);
            next++;
            zeroTurn = true;
            lock.unlock();
            turnChanged.notify_all();
        }
    }

    void odd(std::function<void(int)> printNumber) {
        for (int i = 1; i <= n; i += 2) {
            std::unique_lock<std::mutex> lock(mutex);
            turnChanged.wait(lock, [this, i] { return !zeroTurn && next == i; });
            printNumber(i);
            next++;
            zeroTurn = true;
            lock.unlock();
            turnChanged.notify_all();
        }
    }
};`,
      JavaScript: `class ZeroEvenOdd {
    constructor(n) {
        this.n = n;
        this.next = 1;
        this.zeroTurn = true;
        this.waiters = [];
    }

    async waitForTurn(predicate) {
        while (!predicate()) {
            await new Promise((resolve) => this.waiters.push(resolve));
        }
    }

    wakeAll() {
        for (const wake of this.waiters.splice(0)) wake();
    }

    async zero(printNumber) {
        for (let i = 1; i <= this.n; i++) {
            await this.waitForTurn(() => this.zeroTurn && this.next === i);
            printNumber(0);
            this.zeroTurn = false;
            this.wakeAll();
        }
    }

    async even(printNumber) {
        for (let i = 2; i <= this.n; i += 2) {
            await this.waitForTurn(() => !this.zeroTurn && this.next === i);
            printNumber(i);
            this.next++;
            this.zeroTurn = true;
            this.wakeAll();
        }
    }

    async odd(printNumber) {
        for (let i = 1; i <= this.n; i += 2) {
            await this.waitForTurn(() => !this.zeroTurn && this.next === i);
            printNumber(i);
            this.next++;
            this.zeroTurn = true;
            this.wakeAll();
        }
    }
}`,
    },
  },
  {
    id: 'building-h2o-molecule',
    slug: 'building-h2o-molecule',
    title: 'Building H2O Molecule',
    difficulty: 'Medium',
    category: 'Thread Synchronization & Coordination',
    frequency: 4,
    leetcodeUrl: 'https://leetcode.com/problems/building-h2o/',
    topics: ['Concurrency', 'Synchronization', 'Barrier'],
    companies: ['Google', 'Microsoft', 'Uber'],
    description: `There are two kinds of threads: \`oxygen\` and \`hydrogen\`.
The threads are attempting to combine to form water molecules ($H_2O$).

A barrier condition exists where each molecule requires:
- Exactly two hydrogen threads.
- Exactly one oxygen thread.

All three threads must arrive and complete together before any of the threads may proceed to the next molecule.`,
    note: 'Use Semaphores or CyclicBarrier to synchronize thread arrival groups of 3.',
    examples: [
      {
        id: 1,
        input: 'water = "HOH"',
        output: '"HHO"',
        explanation: 'Two H atoms and one O atom combined into H2O.',
      },
    ],
    constraints: ['water string consists only of characters H and O.'],
    starterCodes: {
      Java: `import java.util.concurrent.Semaphore;
import java.util.concurrent.CyclicBarrier;

class H2O {
    private final Semaphore hSem = new Semaphore(2);
    private final Semaphore oSem = new Semaphore(1);
    private final CyclicBarrier barrier = new CyclicBarrier(3);

    public H2O() {}

    public void hydrogen(Runnable releaseHydrogen) throws InterruptedException {
        // Write your code here
    }

    public void oxygen(Runnable releaseOxygen) throws InterruptedException {
        // Write your code here
    }
}`,
      Python: `from threading import Semaphore, Barrier

class H2O:
    def __init__(self):
        self.h_sem = Semaphore(2)
        self.o_sem = Semaphore(1)
        self.barrier = Barrier(3)

    def hydrogen(self, releaseHydrogen: 'Callable[[], None]') -> None:
        pass

    def oxygen(self, releaseOxygen: 'Callable[[], None]') -> None:
        pass`,
      'C++': `#include <condition_variable>
#include <functional>
#include <mutex>

class H2O {
private:
    int hydrogenCount = 0;
    int oxygenCount = 0;
    std::mutex mutex;
    std::condition_variable moleculeReady;

public:
    void hydrogen(std::function<void()> releaseHydrogen) {
        // Admit at most two hydrogen callbacks in each molecule group.
    }

    void oxygen(std::function<void()> releaseOxygen) {
        // Admit at most one oxygen callback in each molecule group.
    }
};`,
      JavaScript: `class H2O {}`,
      TypeScript: `class H2O {}`,
    },
    solutionCode: {
      Java: `import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.Semaphore;

class H2O {
    private final Semaphore hSem = new Semaphore(2);
    private final Semaphore oSem = new Semaphore(1);
    private final CyclicBarrier barrier = new CyclicBarrier(3);

    public H2O() {}

    public void hydrogen(Runnable releaseHydrogen) throws InterruptedException {
        hSem.acquire();
        try {
            barrier.await();
        } catch (BrokenBarrierException e) {
            e.printStackTrace();
        }
        releaseHydrogen.run();
        hSem.release();
    }

    public void oxygen(Runnable releaseOxygen) throws InterruptedException {
        oSem.acquire();
        try {
            barrier.await();
        } catch (BrokenBarrierException e) {
            e.printStackTrace();
        }
        releaseOxygen.run();
        oSem.release();
    }
}`,
      Python: `from threading import Semaphore, Barrier

class H2O:
    def __init__(self):
        self.h_sem = Semaphore(2)
        self.o_sem = Semaphore(1)
        self.barrier = Barrier(3)

    def hydrogen(self, releaseHydrogen: 'Callable[[], None]') -> None:
        self.h_sem.acquire()
        self.barrier.wait()
        releaseHydrogen()
        self.h_sem.release()

    def oxygen(self, releaseOxygen: 'Callable[[], None]') -> None:
        self.o_sem.acquire()
        self.barrier.wait()
        releaseOxygen()
        self.o_sem.release()`,
      'C++': `#include <condition_variable>
#include <functional>
#include <mutex>

class H2O {
private:
    int hydrogenCount = 0;
    int oxygenCount = 0;
    std::mutex mutex;
    std::condition_variable moleculeReady;

    void finishAtom() {
        if (hydrogenCount == 2 && oxygenCount == 1) {
            hydrogenCount = 0;
            oxygenCount = 0;
        }
    }

public:
    void hydrogen(std::function<void()> releaseHydrogen) {
        std::unique_lock<std::mutex> lock(mutex);
        moleculeReady.wait(lock, [this] { return hydrogenCount < 2; });
        releaseHydrogen();
        hydrogenCount++;
        finishAtom();
        lock.unlock();
        moleculeReady.notify_all();
    }

    void oxygen(std::function<void()> releaseOxygen) {
        std::unique_lock<std::mutex> lock(mutex);
        moleculeReady.wait(lock, [this] { return oxygenCount < 1; });
        releaseOxygen();
        oxygenCount++;
        finishAtom();
        lock.unlock();
        moleculeReady.notify_all();
    }
};`,
      JavaScript: `class H2O {
    constructor() {
        this.hydrogenCount = 0;
        this.oxygenCount = 0;
        this.waiters = [];
    }

    async waitFor(predicate) {
        while (!predicate()) {
            await new Promise((resolve) => this.waiters.push(resolve));
        }
    }

    finishAtom() {
        if (this.hydrogenCount === 2 && this.oxygenCount === 1) {
            this.hydrogenCount = 0;
            this.oxygenCount = 0;
            for (const wake of this.waiters.splice(0)) wake();
        }
    }

    async hydrogen(releaseHydrogen) {
        await this.waitFor(() => this.hydrogenCount < 2);
        releaseHydrogen();
        this.hydrogenCount++;
        this.finishAtom();
    }

    async oxygen(releaseOxygen) {
        await this.waitFor(() => this.oxygenCount < 1);
        releaseOxygen();
        this.oxygenCount++;
        this.finishAtom();
    }
}`,
    },
  },
  {
    id: 'the-dining-philosophers',
    slug: 'the-dining-philosophers',
    title: 'The Dining Philosophers',
    difficulty: 'Medium',
    category: 'Thread Synchronization & Coordination',
    frequency: 5,
    leetcodeUrl: 'https://leetcode.com/problems/the-dining-philosophers/',
    topics: ['Concurrency', 'Deadlock', 'Resource Allocation'],
    companies: ['Google', 'Microsoft', 'Apple'],
    description: `Five silent philosophers sit around a round table with bowls of spaghetti. Forks are placed between each pair of adjacent philosophers.

Each philosopher alternates between thinking and eating. However, a philosopher can only eat spaghetti when they possess both their left and right forks.

Design an algorithm that allows philosophers to pick up and put down forks without deadlocking or starving any philosopher.`,
    note: 'Resource hierarchy (e.g. always pick lower numbered fork first) or limiting dining philosophers to 4 at a time prevents circular wait.',
    examples: [
      {
        id: 1,
        input: 'n = 1 (each philosopher eats 1 time)',
        output: 'All 5 philosophers finish eating without deadlock',
      },
    ],
    constraints: ['5 philosophers, numbered 0 to 4.'],
    starterCodes: {
      Java: `import java.util.concurrent.Semaphore;
import java.util.concurrent.locks.ReentrantLock;

class DiningPhilosophers {
    private final ReentrantLock[] forks = new ReentrantLock[5];
    private final Semaphore maxDiners = new Semaphore(4);

    public DiningPhilosophers() {
        for (int i = 0; i < 5; i++) forks[i] = new ReentrantLock();
    }

    public void wantsToEat(int philosopher,
                           Runnable pickLeftFork,
                           Runnable pickRightFork,
                           Runnable eat,
                           Runnable putLeftFork,
                           Runnable putRightFork) throws InterruptedException {
        // Write your code here
    }
}`,
      Python: `from threading import Lock, Semaphore

class DiningPhilosophers:
    def __init__(self):
        self.forks = [Lock() for _ in range(5)]
        self.limit = Semaphore(4)

    def wantsToEat(self, philosopher, pickLeftFork, pickRightFork, eat, putLeftFork, putRightFork):
        pass`,
      'C++': `#include <array>
#include <functional>
#include <mutex>

class DiningPhilosophers {
private:
    std::array<std::mutex, 5> forks;
public:
    DiningPhilosophers() {}
    void wantsToEat(int philosopher,
                    std::function<void()> pickLeftFork,
                    std::function<void()> pickRightFork,
                    std::function<void()> eat,
                    std::function<void()> putLeftFork,
                    std::function<void()> putRightFork) {
        // Acquire both forks in a consistent global order, then call actions.
    }
};`,
      JavaScript: `class DiningPhilosophers {
    async wantsToEat(philosopher, pickLeftFork, pickRightFork, eat, putLeftFork, putRightFork) {
        // Acquire both forks, run the callbacks, then release both forks.
    }
}`,
      TypeScript: `class DiningPhilosophers {}`,
    },
    solutionCode: {
      Java: `import java.util.concurrent.Semaphore;
import java.util.concurrent.locks.ReentrantLock;

class DiningPhilosophers {
    private final ReentrantLock[] forks = new ReentrantLock[5];
    private final Semaphore maxDiners = new Semaphore(4);

    public DiningPhilosophers() {
        for (int i = 0; i < 5; i++) forks[i] = new ReentrantLock();
    }

    public void wantsToEat(int philosopher,
                           Runnable pickLeftFork,
                           Runnable pickRightFork,
                           Runnable eat,
                           Runnable putLeftFork,
                           Runnable putRightFork) throws InterruptedException {
        int left = philosopher;
        int right = (philosopher + 1) % 5;

        maxDiners.acquire();
        forks[left].lock();
        forks[right].lock();

        pickLeftFork.run();
        pickRightFork.run();
        eat.run();
        putLeftFork.run();
        putRightFork.run();

        forks[right].unlock();
        forks[left].unlock();
        maxDiners.release();
    }
}`,
      Python: `from threading import Lock, Semaphore

class DiningPhilosophers:
    def __init__(self):
        self.forks = [Lock() for _ in range(5)]
        self.limit = Semaphore(4)

    def wantsToEat(self, philosopher, pickLeftFork, pickRightFork, eat, putLeftFork, putRightFork):
        left = philosopher
        right = (philosopher + 1) % 5

        with self.limit:
            with self.forks[left]:
                with self.forks[right]:
                    pickLeftFork()
                    pickRightFork()
                    eat()
                    putLeftFork()
                    putRightFork()`,
      'C++': `#include <array>
#include <functional>
#include <mutex>

class DiningPhilosophers {
private:
    std::array<std::mutex, 5> forks;
public:
    DiningPhilosophers() {}
    void wantsToEat(int philosopher,
                    std::function<void()> pickLeftFork,
                    std::function<void()> pickRightFork,
                    std::function<void()> eat,
                    std::function<void()> putLeftFork,
                    std::function<void()> putRightFork) {
        int left = philosopher;
        int right = (philosopher + 1) % 5;
        int first = std::min(left, right);
        int second = std::max(left, right);
        std::unique_lock<std::mutex> firstLock(forks[first]);
        std::unique_lock<std::mutex> secondLock(forks[second]);
        pickLeftFork();
        pickRightFork();
        eat();
        putLeftFork();
        putRightFork();
    }
};`,
      JavaScript: `class DiningPhilosophers {
    constructor() {
        this.forks = Array.from({ length: 5 }, () => Promise.resolve());
    }

    async acquire(fork) {
        let release;
        const current = new Promise((resolve) => { release = resolve; });
        const previous = this.forks[fork];
        this.forks[fork] = current;
        await previous;
        return release;
    }

    async wantsToEat(philosopher, pickLeftFork, pickRightFork, eat, putLeftFork, putRightFork) {
        const left = philosopher;
        const right = (philosopher + 1) % 5;
        const releases = new Map();
        for (const fork of [left, right].sort((a, b) => a - b)) releases.set(fork, await this.acquire(fork));
        try {
            pickLeftFork();
            pickRightFork();
            eat();
            putLeftFork();
            putRightFork();
        } finally {
            for (const fork of [left, right].sort((a, b) => b - a)) releases.get(fork)();
        }
    }
}`,
    },
  },
  {
    id: 'read-write-lock-implementation',
    slug: 'read-write-lock-implementation',
    title: 'Read Write Lock Implementation',
    difficulty: 'Hard',
    category: 'Thread Synchronization & Coordination',
    frequency: 4,
    leetcodeUrl: 'https://leetcode.com/discuss/interview-question/concurrency',
    topics: ['Concurrency', 'Locks', 'Read-Write Lock'],
    companies: ['Amazon', 'Google', 'Meta', 'Netflix'],
    description: `Implement a fair Read-Write Lock from scratch.

A Read-Write Lock allows:
- **Multiple concurrent readers** when no writers hold or request the lock.
- **Strictly exclusive access for writers**: no other readers or writers may execute while a writer writes.
- **Fairness guarantee**: To prevent writer starvation, if a writer is waiting, subsequent reader requests must wait behind the writer.`,
    note: 'Ensure writer-preference or fair queueing so writers do not starve under continuous reader traffic.',
    examples: [
      {
        id: 1,
        input: 'readers = 3, writer = 1',
        output: 'All readers read concurrently; writer acquires lock exclusively after current readers exit.',
      },
    ],
    constraints: ['Must handle reentrancy considerations or clean acquisition/release semantics.'],
    starterCodes: {
      Java: `class ReadWriteLock {
    private int readers = 0;
    private int writers = 0;
    private int writeRequests = 0;

    public synchronized void lockRead() throws InterruptedException {
        // Write your code here
    }

    public synchronized void unlockRead() {
        // Write your code here
    }

    public synchronized void lockWrite() throws InterruptedException {
        // Write your code here
    }

    public synchronized void unlockWrite() {
        // Write your code here
    }
}`,
      Python: `from threading import Condition, Lock

class ReadWriteLock:
    def __init__(self):
        self.lock = Lock()
        self.cond = Condition(self.lock)
        self.readers = 0
        self.writers = 0
        self.write_requests = 0

    def lock_read(self):
        pass

    def unlock_read(self):
        pass

    def lock_write(self):
        pass

    def unlock_write(self):
        pass`,
      'C++': `#include <mutex>
#include <condition_variable>

class ReadWriteLock {
private:
    std::mutex mtx;
    std::condition_variable cv;
    int readers = 0;
    int writers = 0;
    int write_requests = 0;

public:
    void lockRead() {}
    void unlockRead() {}
    void lockWrite() {}
    void unlockWrite() {}
};`,
      JavaScript: `class ReadWriteLock {}`,
      TypeScript: `class ReadWriteLock {}`,
    },
    solutionCode: {
      Java: `class ReadWriteLock {
    private int readers = 0;
    private int writers = 0;
    private int writeRequests = 0;

    public synchronized void lockRead() throws InterruptedException {
        while (writers > 0 || writeRequests > 0) {
            wait();
        }
        readers++;
    }

    public synchronized void unlockRead() {
        readers--;
        notifyAll();
    }

    public synchronized void lockWrite() throws InterruptedException {
        writeRequests++;
        while (readers > 0 || writers > 0) {
            wait();
        }
        writeRequests--;
        writers++;
    }

    public synchronized void unlockWrite() {
        writers--;
        notifyAll();
    }
}`,
      Python: `from threading import Condition, Lock

class ReadWriteLock:
    def __init__(self):
        self.lock = Lock()
        self.cond = Condition(self.lock)
        self.readers = 0
        self.writers = 0
        self.write_requests = 0

    def lock_read(self):
        with self.cond:
            while self.writers > 0 or self.write_requests > 0:
                self.cond.wait()
            self.readers += 1

    def unlock_read(self):
        with self.cond:
            self.readers -= 1
            self.cond.notify_all()

    def lock_write(self):
        with self.cond:
            self.write_requests += 1
            while self.readers > 0 or self.writers > 0:
                self.cond.wait()
            self.write_requests -= 1
            self.writers += 1

    def unlock_write(self):
        with self.cond:
            self.writers -= 1
            self.cond.notify_all()`,
      'C++': `#include <mutex>
#include <condition_variable>

class ReadWriteLock {
private:
    std::mutex mtx;
    std::condition_variable cv;
    int readers = 0;
    int writers = 0;
    int write_requests = 0;

public:
    void lockRead() {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [&] { return writers == 0 && write_requests == 0; });
        ++readers;
    }

    void unlockRead() {
        std::lock_guard<std::mutex> lock(mtx);
        --readers;
        cv.notify_all();
    }

    void lockWrite() {
        std::unique_lock<std::mutex> lock(mtx);
        ++write_requests;
        cv.wait(lock, [&] { return readers == 0 && writers == 0; });
        --write_requests;
        ++writers;
    }

    void unlockWrite() {
        std::lock_guard<std::mutex> lock(mtx);
        --writers;
        cv.notify_all();
    }
};`,
      JavaScript: `class ReadWriteLock {
    constructor() {
        this.readers = 0;
        this.writerActive = false;
        this.waitingWriters = 0;
        this.waitingReaders = [];
        this.waitingWritersQueue = [];
    }

    lockRead() {
        if (!this.writerActive && this.waitingWriters === 0) {
            this.readers++;
            return Promise.resolve();
        }
        return new Promise((resolve) => this.waitingReaders.push(resolve));
    }

    unlockRead() {
        this.readers--;
        this._wake();
    }

    lockWrite() {
        this.waitingWriters++;
        return new Promise((resolve) => {
            this.waitingWritersQueue.push(() => {
                this.waitingWriters--;
                this.writerActive = true;
                resolve();
            });
            this._wake();
        });
    }

    unlockWrite() {
        this.writerActive = false;
        this._wake();
    }

    _wake() {
        if (this.writerActive || this.readers > 0) return;
        if (this.waitingWritersQueue.length > 0) {
            this.waitingWritersQueue.shift()();
            return;
        }
        while (this.waitingReaders.length > 0) {
            this.readers++;
            this.waitingReaders.shift()();
        }
    }
}`,
    },
  },
];
