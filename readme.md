# 🕰️ HOROLOGIUM

*"Where time meets timeless elegance"* ✨

A luxury watch encyclopedia featuring premium brands, interactive 3D cards, and responsive design. Built with React, Vite, and GSAP animations.

### Testing Stack
```json
{
  "@testing-library/react": "^16.3.2",
  "@testing-library/jest-dom": "^6.9.1",
  "jsdom": "^29.1.1",
  "vitest": "^4.1.5"
}
```

### Test Coverage
- Unit Tests: Component functionality
- Integration Tests: User flows and interactions
- Visual Tests: Design system consistency
- Accessibility Tests: WCAG compliance

### Build Process
```bash
# Production build
npm run build

# Output directory: dist/
# - Optimized assets
# - Minified CSS/JS
# - Pre-compressed files
```

### Hosting Recommendations
- Netlify: Optimal for SPAs with form handling
- Vercel: Excellent React support and analytics
- AWS S3 + CloudFront: Scalable static hosting
- GitHub Pages: Free hosting for open source

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Standards
- ESLint: Airbnb configuration
- Prettier: Consistent code formatting
- Husky: Pre-commit hooks
- Commitizen: Standardized commit messages

### Adding New Brands
1. Add brand data to `public/data/`
2. Include logo and icon assets
3. Update brand constants in `App.jsx`
4. Test responsive layouts

## 📄 License

Copyright © 2026 HOROLOGIUM. All rights reserved.

This project is proprietary and confidential. Unauthorized use, reproduction, or distribution is strictly prohibited.

## 🙏 Acknowledgments

- Watch Brands: For their exceptional craftsmanship and heritage
- Photography: Professional watch imagery and brand assets
- Open Source: React, Vite, GSAP, and the broader web community
- Design Inspiration: Apple, luxury brands, and modern web experiences

## 📞 Contact

For inquiries about Horologium:
- Email: hello@horologium.com
- Website: https://horologium.com
- Support: support@horologium.com

"Horologium: Where time meets timeless elegance" ✨
- Minimal luxury style

## 📊 Features

### Home Page
- Hero headline
- Animated watch
- CTA buttons
- Tier explanation

### Brand Page
- Grid of brands
- Search functionality
- Tier filter

### Brand Detail
- AI-generated brand story
- Watch list
- Gender filter

### Watch Detail
- Deep storytelling
- Technical specs grid
- Investment insights

### Guide Page
- Beginner education
- Clean editorial layout

## 🤖 AI Integration

Function:

askClaude(system, user)

Returns:
- Watch list JSON
- Brand story JSON
- Watch details JSON

Strict parsing required.

## 🎯 UX Principles

- Minimal but rich
- Cinematic spacing
- Smooth animations
- Premium feel

## ⚡ Performance

- Avoid re-renders
- Keep state clean
- Lightweight animations

## 🚀 Final Goal

Not just a website.

A luxury digital experience that:
- Educates watch enthusiasts with comprehensive brand knowledge
- Provides an immersive, cinematic browsing experience
- Showcases horological craftsmanship through interactive storytelling
- Creates a premium digital destination for luxury watch culture
- Bridges traditional watchmaking heritage with modern web technology
- Offers a serene, contemplative space for watch appreciation
- Delivers expert-level content accessible to all skill levels
- Establishes itself as the definitive online watch encyclopedia