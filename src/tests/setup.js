import '@testing-library/jest-dom';

// Mock fetch for projects data
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([
      {
        title: "Test Project",
        description: "A test project",
        image: "/test-image.jpg",
        link: "https://example.com",
        tags: ["React", "JavaScript"]
      }
    ]),
  })
);