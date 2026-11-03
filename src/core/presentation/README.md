# Presentation Layer

UI components and pages. No business logic.

## Structure

- ui/ - atoms, molecules, organisms
- features/ - interactive features (smart/dumb/presenter pattern)
- layouts/ - page layouts
- pages/ - page modules

## Rules

- Dumb views receive data, don't calculate
- Smart controllers in features/ only
- No business logic in views
- Uses only types from other layers
