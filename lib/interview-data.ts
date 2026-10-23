export interface InterviewConfig {
  type: 'coding' | 'system-design' | 'lld';
  title: string;
  subtitle: string;
  durationMinutes: number;
}

export interface SystemDesignProblem {
  id: string;
  title: string;
  section: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  keyRequirements: string[];
  scaleMetrics: {
    dps?: string;
    qps?: string;
    storage?: string;
    latency?: string;
  };
  components: string[];
  learnUrl?: string;
}

export interface LldProblem {
  id: string;
  title: string;
  section: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  designPatterns: string[];
  keyClasses: string[];
  solidPrinciples: string[];
  starterLanguage: string;
  codeSkeleton: string;
}

export const SYSTEM_DESIGN_PROBLEMS: SystemDesignProblem[] = [
  {
    id: 'design-url-shortener',
    title: 'Design a URL Shortener (TinyURL)',
    section: 'Basic Questions',
    difficulty: 'Easy',
    description: 'Design a scalable service like TinyURL that produces short aliases for long URLs, handling millions of redirects per day with sub-millisecond response time.',
    keyRequirements: [
      'Given a URL, generate a unique 7-character hash alias.',
      'Redirect user to original URL with low latency.',
      'Custom alias support and optional URL expiration.',
      'High availability (99.99%) and read-heavy optimization (100:1 read to write ratio).'
    ],
    scaleMetrics: {
      dps: '100M URLs generated per month',
      qps: '10,000 read QPS, 100 write QPS',
      storage: '15 TB across 5 years',
      latency: '< 10ms redirect latency'
    },
    components: ['API Gateway / Rate Limiter', 'Base62 Hash Token Generator', 'Redis Cache Cluster', 'NoSQL / DynamoDB KV Store'],
    learnUrl: '/learn/system-design-interviews'
  },
  {
    id: 'design-rate-limiter',
    title: 'Design an API Rate Limiter',
    section: 'Basic Questions',
    difficulty: 'Medium',
    description: 'Design a distributed rate limiter middleware capable of throttling millions of client requests per second across microservices based on client IP or API key.',
    keyRequirements: [
      'Accurately limit request counts per user IP or API token.',
      'Inform client with HTTP 429 Too Many Requests when threshold exceeded.',
      'Extremely low memory footprint and negligible latency penalty (< 2ms).',
      'Distributed clock synchronization tolerance.'
    ],
    scaleMetrics: {
      qps: '100,000 requests/sec',
      latency: '< 2ms decision overhead',
      storage: '1 GB memory for 10M active rate limits'
    },
    components: ['Token Bucket / Sliding Window Log', 'Redis Cluster with Lua Scripts', 'Config Service (etcd / ZooKeeper)'],
    learnUrl: '/learn/system-design-interviews'
  },
  {
    id: 'design-pastebin',
    title: 'Design a Pastebin Service',
    section: 'Basic Questions',
    difficulty: 'Easy',
    description: 'Design a text storage sharing platform where users can upload snippets of text, code, or logs and retrieve them via random unique URLs.',
    keyRequirements: [
      'Upload text up to 10MB per paste.',
      'Access pastes with custom expiration timestamps.',
      'Immutable pastes with anonymous read access.',
      'Horizontal scalability for multi-terabyte log archives.'
    ],
    scaleMetrics: {
      qps: '5,000 read QPS, 500 write QPS',
      storage: '30 TB / year',
      latency: '< 25ms retrieval'
    },
    components: ['Object Storage (S3 / MinIO)', 'Metadata Store (PostgreSQL / Cassandra)', 'Edge CDN Cache'],
    learnUrl: '/learn/system-design-interviews'
  },
  {
    id: 'design-chat-system',
    title: 'Design a Scalable Chat Application (WhatsApp/Slack)',
    section: 'Real-Time & Streaming',
    difficulty: 'Hard',
    description: 'Design a real-time messaging system supporting 1-on-1 private messaging, group chats, message history search, online/offline presence, and push notifications.',
    keyRequirements: [
      'Sub-50ms message delivery between online peers.',
      'Offline message queueing with read receipts (sent, delivered, read).',
      'Group messaging with fanout up to 1,000 members per channel.',
      'End-to-end encryption handshake and multi-device synchronization.'
    ],
    scaleMetrics: {
      qps: '500M Daily Active Users, 10B messages / day',
      storage: '50 TB daily chat storage',
      latency: '< 50ms real-time delivery'
    },
    components: ['WebSocket Gateway Cluster', 'Presence Service & Heartbeat', 'Kafka / RabbitMQ Message Queue', 'Cassandra Chat Storage'],
    learnUrl: '/learn/system-design-interviews'
  },
  {
    id: 'design-distributed-cache',
    title: 'Design a Distributed In-Memory Cache (Redis/Memcached)',
    section: 'Infrastructure & Storage',
    difficulty: 'Hard',
    description: 'Design a distributed key-value cache system featuring consistent hashing, configurable eviction policies (LRU/LFU), and master-replica failover.',
    keyRequirements: [
      'O(1) average get and put operations with thread-safe memory pooling.',
      'Consistent hashing with virtual nodes to minimize rehash key movement.',
      'Eviction policies (LRU, LFU, TTL expiration clock).',
      'Replication across zones with raft consensus.'
    ],
    scaleMetrics: {
      qps: '1,000,000 QPS across nodes',
      latency: '< 1ms response time',
      storage: '2 TB in-memory capacity'
    },
    components: ['Consistent Hash Ring', 'Concurrent HashMap with LRU Doubly LinkedList', 'Gossip Protocol / Sentinel Node'],
    learnUrl: '/learn/system-design-interviews'
  },
  {
    id: 'design-twitter-feed',
    title: 'Design Social News Feed (Twitter / X Timeline)',
    section: 'Content & Social Networks',
    difficulty: 'Medium',
    description: 'Design the timeline architecture for a social network where users can post tweets, follow others, and view an aggregated timeline ranked by recency.',
    keyRequirements: [
      'Fast timeline generation (< 150ms) for high follower counts.',
      'Fan-out on write (push model) for regular users, fan-out on read (pull model) for celebrities.',
      'Media attachments storage and thumbnail processing pipeline.'
    ],
    scaleMetrics: {
      qps: '300,000 feed read QPS, 10,000 post QPS',
      storage: '100 TB media & tweet archive',
      latency: '< 100ms timeline render'
    },
    components: ['Timeline Cache Aggregator', 'Fanout Worker Pool', 'Graph Database (Followers Graph)', 'Blob Storage'],
    learnUrl: '/learn/system-design-interviews'
  }
];

export const LLD_PROBLEMS: LldProblem[] = [
  {
    id: 'design-parking-lot',
    title: 'Design an Automated Parking Lot System',
    section: 'Object-Oriented Modeling',
    difficulty: 'Medium',
    description: 'Design a multi-floor parking lot system that accommodates multiple vehicle types (Motorbike, Car, Truck), issues automated entry tickets, calculates hourly pricing, and supports multiple payment methods.',
    designPatterns: ['Factory Pattern (Vehicle & Spot creation)', 'Strategy Pattern (Fee Calculation)', 'Singleton Pattern (ParkingLot Manager)'],
    keyClasses: ['ParkingLot', 'ParkingFloor', 'ParkingSpot', 'Vehicle', 'ParkingTicket', 'FeeCalculator'],
    solidPrinciples: ['Single Responsibility Principle', 'Open/Closed Principle (pricing strategies)', 'Dependency Inversion'],
    starterLanguage: 'Java',
    codeSkeleton: `public enum VehicleType { MOTORBIKE, CAR, TRUCK }
public enum SpotStatus { AVAILABLE, OCCUPIED, RESERVED }

public abstract class Vehicle {
    private String licensePlate;
    private VehicleType type;
    public Vehicle(String licensePlate, VehicleType type) {
        this.licensePlate = licensePlate;
        this.type = type;
    }
    public VehicleType getType() { return type; }
}

public class Car extends Vehicle {
    public Car(String licensePlate) { super(licensePlate, VehicleType.CAR); }
}

public interface PricingStrategy {
    double calculateFee(long durationMinutes, VehicleType type);
}`
  },
  {
    id: 'design-elevator-system',
    title: 'Design an Elevator Control System',
    section: 'Concurrent & State-Driven Systems',
    difficulty: 'Hard',
    description: 'Design a dispatch controller for a bank of N elevators in a multi-story building that optimizes wait times, handles up/down floor requests, and maintains elevator states safely.',
    designPatterns: ['State Pattern (Idle, Moving_Up, Moving_Down, Maintenance)', 'Observer Pattern (Display boards and sensors)', 'Strategy Pattern (SCAN / LOOK Elevator Dispatch algorithm)'],
    keyClasses: ['ElevatorController', 'ElevatorCar', 'Floor', 'Request', 'InternalButton', 'ExternalButton'],
    solidPrinciples: ['Interface Segregation', 'Open/Closed for dispatch strategies'],
    starterLanguage: 'Java',
    codeSkeleton: `public enum Direction { UP, DOWN, IDLE }
public enum ElevatorState { MOVING, STOPPED, DOOR_OPEN, MAINTENANCE }

public class Request {
    private int sourceFloor;
    private int destinationFloor;
    private Direction direction;
}

public interface DispatchStrategy {
    ElevatorCar selectElevator(List<ElevatorCar> elevators, Request request);
}

public class ElevatorCar {
    private int id;
    private int currentFloor;
    private Direction currentDirection;
    private ElevatorState state;
    private TreeSet<Integer> destinationFloors;
}`
  },
  {
    id: 'design-tic-tac-toe',
    title: 'Design Tic-Tac-Toe Game with N×N Board',
    section: 'Game Design & Rules Engines',
    difficulty: 'Easy',
    description: 'Design a generalized N×N Tic-Tac-Toe game supporting M players with custom pieces, validating win conditions in O(1) time per move, and recording game histories with undo/redo capability.',
    designPatterns: ['Command Pattern (Undo / Redo Moves)', 'State Pattern (GameStatus: In_Progress, Draw, Won)'],
    keyClasses: ['TicTacToeGame', 'Board', 'Player', 'Piece (PieceX, PieceO)', 'MoveCommand'],
    solidPrinciples: ['Single Responsibility for Board check', 'Liskov Substitution for Pieces'],
    starterLanguage: 'TypeScript',
    codeSkeleton: `export enum PieceType { X = 'X', O = 'O', TRIANGLE = 'Δ' }

export class Player {
  constructor(public id: string, public name: string, public piece: PieceType) {}
}

export class Board {
  private grid: (PieceType | null)[][];
  private rowCounts: Map<PieceType, number[]>;
  private colCounts: Map<PieceType, number[]>;
  private diagCount: Map<PieceType, number>;
  private antiDiagCount: Map<PieceType, number>;

  constructor(public readonly size: number) {
    this.grid = Array.from({ length: size }, () => Array(size).fill(null));
  }
}`
  },
  {
    id: 'design-rate-limiter-lld',
    title: 'Low-Level Design: Token Bucket Rate Limiter',
    section: 'Concurrency & Algorithms',
    difficulty: 'Medium',
    description: 'Implement a thread-safe in-memory rate limiter using the Token Bucket and Sliding Window algorithm with high throughput and lock-free atomic references where appropriate.',
    designPatterns: ['Strategy Pattern (TokenBucket vs SlidingWindow)', 'Decorator Pattern (Middleware wrapper)'],
    keyClasses: ['RateLimiter', 'TokenBucketStrategy', 'SlidingWindowStrategy', 'ClientRatePolicy'],
    solidPrinciples: ['Open/Closed for new algorithms', 'Dependency Inversion'],
    starterLanguage: 'Java',
    codeSkeleton: `public interface RateLimiter {
    boolean allowRequest(String clientId);
}

public class TokenBucketRateLimiter implements RateLimiter {
    private final long capacity;
    private final double refillRatePerSecond;
    private final ConcurrentHashMap<String, Bucket> clientBuckets = new ConcurrentHashMap<>();

    private static class Bucket {
        double tokens;
        long lastRefillTimestamp;
        synchronized boolean tryConsume() {
            // Refill logic and token deduction
            return false;
        }
    }
}`
  },
  {
    id: 'design-movie-ticket-booking',
    title: 'Design BookMyShow / Cinema Ticket Booking System',
    section: 'Enterprise & Transactional Systems',
    difficulty: 'Hard',
    description: 'Design a seat reservation system for cinemas that handles concurrent bookings, temporary seat locks (timeout within 8 minutes), dynamic pricing, and transactional integrity.',
    designPatterns: ['Unit of Work / Transaction Pattern', 'Factory Pattern for Payment gateways', 'Observer Pattern for booking notifications'],
    keyClasses: ['BookingService', 'Cinema', 'Screen', 'Seat', 'Show', 'Booking', 'PaymentProcessor'],
    solidPrinciples: ['Single Responsibility', 'Interface Segregation on Payment Handlers'],
    starterLanguage: 'Java',
    codeSkeleton: `public enum SeatType { REGULAR, PREMIUM, VIP }
public enum SeatStatus { AVAILABLE, LOCKED, BOOKED }

public class Seat {
    private String id;
    private int row;
    private int column;
    private SeatType type;
}

public class Show {
    private String id;
    private Movie movie;
    private Screen screen;
    private LocalDateTime startTime;
    private Map<String, SeatStatus> seatInventory;
}`
  }
];
