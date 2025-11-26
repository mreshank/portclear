// TypeScript definitions for port-clear

/**
 * Options for port-clear function
 */
export interface PortClearOptions {
  /**
   * Protocol method: 'tcp' or 'udp'
   * @default 'tcp'
   */
  method?: 'tcp' | 'udp';
  
  /**
   * List mode - show process info without killing
   * @default false
   */
  list?: boolean;
  
  /**
   * Kill process tree (including children)
   * @default false
   */
  tree?: boolean;
}

/**
 * Result returned from port-clear function
 */
export interface PortClearResult {
  /**
   * Port number
   */
  port: number;
  
  /**
   * Whether the process was killed
   */
  killed: boolean;
  
  /**
   * Operating system platform
   */
  platform: string;
  
  /**
   * Process ID (single process)
   */
  pid?: number;
  
  /**
   * Process IDs (multiple processes)
   */
  pids?: number[];
  
  /**
   * Process name
   */
  name?: string;
  
  /**
   * Error message if operation failed
   */
  error?: string;
  
  /**
   * Standard output from kill command
   */
  stdout?: string;
  
  /**
   * Standard error from kill command
   */
  stderr?: string;
  
  /**
   * Whether this is a listing result (not a kill)
   */
  listing?: boolean;
}

/**
 * Kill process running on specified port
 * 
 * @param port - Port number to kill (1-65535)
 * @param methodOrOptions - Protocol method ('tcp'/'udp') or options object
 * @returns Promise resolving to result object with process information
 * 
 * @example
 * // Kill process on port 3000
 * await portClear(3000);
 * 
 * @example
 * // Kill UDP process
 * await portClear(3000, 'udp');
 * 
 * @example
 * // List process without killing
 * const result = await portClear(3000, { list: true });
 * if (result.pid) {
 *   console.log(`Process ${result.name} (PID: ${result.pid}) is running on port 3000`);
 * }
 * 
 * @example
 * // Kill process tree
 * await portClear(3000, { tree: true });
 * 
 * @example
 * // With TypeScript type safety
 * const result: PortClearResult = await portClear(3000, { 
 *   method: 'tcp',
 *   list: false,
 *   tree: true 
 * });
 */
declare function portClear(
  port: number | string,
  methodOrOptions?: string | PortClearOptions
): Promise<PortClearResult>;

export default portClear;
export = portClear;
