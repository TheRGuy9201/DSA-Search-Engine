export const dijkstraImplementations = {
  c: `
#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

#define V 9 // Number of vertices

// Find the vertex with minimum distance value
int minDistance(int dist[], bool sptSet[]) {
  int min = INT_MAX, min_index;
  
  for (int v = 0; v < V; v++) {
    if (!sptSet[v] && dist[v] <= min) {
      min = dist[v];
      min_index = v;
    }
  }
  
  return min_index;
}

// Print the solution
void printSolution(int dist[]) {
  printf("Vertex \\t Distance from Source\\n");
  for (int i = 0; i < V; i++) {
    printf("%d \\t %d\\n", i, dist[i]);
  }
}

// Dijkstra's algorithm for a graph represented using adjacency matrix
void dijkstra(int graph[V][V], int src) {
  int dist[V];     // The output array, dist[i] holds the shortest distance from src to i
  bool sptSet[V];  // sptSet[i] will be true if vertex i is included in shortest path tree
  
  // Initialize all distances as INFINITE and stpSet[] as false
  for (int i = 0; i < V; i++) {
    dist[i] = INT_MAX;
    sptSet[i] = false;
  }
  
  // Distance of source vertex from itself is always 0
  dist[src] = 0;
  
  // Find shortest path for all vertices
  for (int count = 0; count < V - 1; count++) {
    int u = minDistance(dist, sptSet);
    sptSet[u] = true;
    
    // Update dist value of adjacent vertices
    for (int v = 0; v < V; v++) {
      if (!sptSet[v] && graph[u][v] && dist[u] != INT_MAX && dist[u] + graph[u][v] < dist[v]) {
        dist[v] = dist[u] + graph[u][v];
      }
    }
  }
  
  printSolution(dist);
}
`,

  cpp: `
#include <iostream>
#include <vector>
#include <queue>
#include <limits>
using namespace std;

typedef pair<int, int> iPair; // <distance, vertex>

class Graph {
  int V;                      // No. of vertices
  vector<vector<iPair>> adj;  // Adjacency list
  
public:
  Graph(int V) : V(V) {
    adj.resize(V);
  }
  
  // Function to add an edge to graph
  void addEdge(int u, int v, int w) {
    adj[u].push_back(make_pair(v, w));
    adj[v].push_back(make_pair(u, w)); // For undirected graph
  }
  
  // Dijkstra algorithm
  vector<int> shortestPath(int src) {
    // Min-heap to store vertices
    priority_queue<iPair, vector<iPair>, greater<iPair>> pq;
    
    // Distance array initialized to infinity
    vector<int> dist(V, numeric_limits<int>::max());
    
    // Insert source
    pq.push(make_pair(0, src));
    dist[src] = 0;
    
    while (!pq.empty()) {
      // Extract minimum distance vertex
      int u = pq.top().second;
      pq.pop();
      
      // Traverse all adjacent vertices
      for (const auto& edge : adj[u]) {
        int v = edge.first;
        int weight = edge.second;
        
        // If there's a shorter path to v through u
        if (dist[v] > dist[u] + weight) {
          dist[v] = dist[u] + weight;
          pq.push(make_pair(dist[v], v));
        }
      }
    }
    
    return dist;
  }
};
`,

  python: `
import heapq

def dijkstra(graph, start):
    """
    Dijkstra's algorithm for finding shortest paths from start node to all nodes.
    
    Args:
        graph: Dictionary of dictionaries representing an adjacency list with weights
               {node: {neighbor: distance, ...}, ...}
        start: Starting node
    
    Returns:
        Dictionary of shortest distances from start to each node
    """
    # Initialize distances dictionary
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    
    # Priority queue
    priority_queue = [(0, start)]
    
    # Track visited nodes
    visited = set()
    
    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)
        
        # If already processed, skip
        if current_node in visited:
            continue
            
        visited.add(current_node)
        
        # Check all neighbors
        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            
            # Only consider if it's a shorter path
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(priority_queue, (distance, neighbor))
    
    return distances
`,

  java: `
import java.util.*;

public class Dijkstra {
    private static class Node implements Comparable<Node> {
        int vertex;
        int distance;
        
        public Node(int vertex, int distance) {
            this.vertex = vertex;
            this.distance = distance;
        }
        
        @Override
        public int compareTo(Node other) {
            return Integer.compare(this.distance, other.distance);
        }
    }
    
    public static int[] shortestPath(List<List<Node>> graph, int source) {
        int n = graph.size();
        int[] distances = new int[n];
        boolean[] visited = new boolean[n];
        
        // Initialize distances array
        Arrays.fill(distances, Integer.MAX_VALUE);
        distances[source] = 0;
        
        // Min-heap priority queue
        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.add(new Node(source, 0));
        
        while (!pq.isEmpty()) {
            Node current = pq.poll();
            int currentVertex = current.vertex;
            
            // Skip if already processed
            if (visited[currentVertex]) continue;
            
            visited[currentVertex] = true;
            
            // Process all neighbors
            for (Node neighbor : graph.get(currentVertex)) {
                int v = neighbor.vertex;
                int weight = neighbor.distance;
                
                if (!visited[v] && distances[currentVertex] != Integer.MAX_VALUE
                    && distances[currentVertex] + weight < distances[v]) {
                    
                    distances[v] = distances[currentVertex] + weight;
                    pq.add(new Node(v, distances[v]));
                }
            }
        }
        
        return distances;
    }
}
`
};

export const dijkstraRelatedProblems = [
  {
    id: "743",
    platform: "leetcode",
    title: "Network Delay Time",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/network-delay-time/"
  },
  {
    id: "1631",
    platform: "leetcode",
    title: "Path With Minimum Effort",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/path-with-minimum-effort/"
  },
  {
    id: "787",
    platform: "leetcode",
    title: "Cheapest Flights Within K Stops",
    difficulty: "Medium",
    url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/"
  },
  {
    id: "20C",
    platform: "codeforces",
    title: "Dijkstra?",
    difficulty: "Hard",
    url: "https://codeforces.com/problemset/problem/20/C"
  }
];

export const dijkstraUseCases = [
  {
    title: "GPS Navigation Systems",
    description: "Dijkstra's algorithm is fundamental in GPS navigation systems to find the shortest or fastest path between locations on a map."
  },
  {
    title: "Network Routing",
    description: "In computer networks, it's used to find the shortest path for data packets, minimizing delay and optimizing network traffic."
  },
  {
    title: "Robotics Path Planning",
    description: "Autonomous robots use Dijkstra's algorithm to navigate through environments while avoiding obstacles and finding optimal paths."
  },
  {
    title: "Telecommunications",
    description: "Used in telecommunication networks to route calls through the least costly paths, balancing load and minimizing connection costs."
  }
];
