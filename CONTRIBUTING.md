# 🤝 Contributing to Government Forms Management System

Thank you for considering contributing to the Government Forms Management System! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [🎯 Getting Started](#-getting-started)
- [💻 Development Setup](#-development-setup)
- [🌿 Branch Strategy](#-branch-strategy)
- [💾 Commit Guidelines](#-commit-guidelines)
- [🧪 Testing](#-testing)
- [📝 Code Standards](#-code-standards)
- [🔄 Pull Request Process](#-pull-request-process)

## 🎯 Getting Started

### Prerequisites
- Docker & Docker Compose
- Git
- Basic knowledge of Django, Next.js, and PostgreSQL

### First-time Setup
```bash
# Fork the repository
git clone https://github.com/your-username/government-forms-system.git
cd government-forms-system

# Start development environment
docker-compose up -d --build

# Create admin user
docker-compose exec backend python manage.py createsuperuser
```

## 💻 Development Setup

### Backend Development
```bash
# Access backend container
docker-compose exec backend bash

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Run tests
python manage.py test
```

### Frontend Development
```bash
# Access frontend container
docker-compose exec frontend bash

# Install packages
npm install package-name

# Run development server
npm run dev
```

## 🌿 Branch Strategy

### Branch Types
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Example
```bash
# Create feature branch
git checkout -b feature/entity-approval-workflow

# Work on your changes
git add .
git commit -m "✨ Add entity approval workflow"

# Push to your fork
git push origin feature/entity-approval-workflow
```

## 💾 Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `✨ feat` - New features
- `🐛 fix` - Bug fixes
- `📚 docs` - Documentation changes
- `💅 style` - Code style changes
- `♻️ refactor` - Code refactoring
- `🧪 test` - Adding tests
- `🔧 chore` - Build/config changes

### Examples
```bash
✨ feat(auth): add JWT refresh token mechanism
🐛 fix(forms): resolve validation error for Arabic text
📚 docs: update API documentation with examples
🔧 chore(docker): optimize container build process
```

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
docker-compose exec backend python manage.py test

# Run specific app tests
docker-compose exec backend python manage.py test forms

# Coverage report
docker-compose exec backend coverage run --source='.' manage.py test
docker-compose exec backend coverage report
```

### Frontend Tests
```bash
# Unit tests
npm test

# Type checking
npm run type-check
```

### Test Requirements
- All new features must include tests
- Bug fixes should include regression tests
- Maintain test coverage above 80%

## 📝 Code Standards

### Backend (Django)
- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for functions and classes
- Use Django best practices

### Frontend (Next.js)
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error handling

## 🔄 Pull Request Process

### Before Submitting
1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Run tests** to ensure nothing breaks
4. **Rebase** on latest main branch

### PR Template
```markdown
## 📋 Description
Brief description of changes

## 🎯 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 🧪 Testing
- [ ] Tests pass locally
- [ ] Added new tests if needed
- [ ] Manual testing completed

## 📝 Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No merge conflicts
```

### Review Process
1. **Automated checks** must pass
2. **At least one approval** required
3. **Discussion** of any concerns
4. **Merge** after approval

## 🆘 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas

### Response Times
- **Bug reports**: Within 48 hours
- **Feature requests**: Within 1 week
- **Pull requests**: Within 72 hours
- **General questions**: Within 1 week

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for major contributions

Thank you for contributing to make government services more accessible and efficient! 🎉
