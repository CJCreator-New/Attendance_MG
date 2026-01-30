# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ESLint configuration for code quality
- Prettier configuration for consistent formatting
- Docker support for containerized deployment
- Environment variables template (.env.example)
- Development setup documentation
- Contributing guidelines
- Employee ID validation for special characters
- Maximum employees limit (500)
- UI constants to replace magic numbers
- Git hooks with Husky and lint-staged

### Changed
- Replaced magic numbers with named constants
- Improved code organization and structure

### Fixed
- Employee ID now validates against special characters
- Storage warning threshold uses constant

## [2.1.0] - 2025-01

### Added
- No hardcoded data - start fresh or import
- Manual entry for attendance sheets
- File import (Excel/CSV)
- Sample templates download
- Flexible data input methods

### Fixed
- Complete salary calculations (ESI, Bonus, OT)
- EPF threshold corrected to ₹21,000
- Excel date conversion
- Opening CL parsing from Excel
- Mobile UI improvements
- All 13 attendance codes support
- Data validation
- Storage quota handling

## [2.0.0] - 2024-12

### Added
- Complete salary breakdown
- Multiple attendance codes
- Mobile optimization
- Data validation
- Storage management

### Changed
- Improved UI/UX
- Better error handling

## [1.0.0] - 2024-11

### Added
- Initial release
- Basic attendance tracking
- Salary calculations
- Excel import/export
