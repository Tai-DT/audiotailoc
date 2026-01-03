/**
 * Unit tests for Card component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card', () => {
  it('should render Card with children', () => {
    render(<Card><div>Card Content</div></Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-card');
  });

  it('should have rounded corners', () => {
    const { container } = render(<Card>Content</Card>);
    // Card uses rounded-3xl in actual implementation
    expect(container.firstChild).toHaveClass('rounded-3xl');
  });
});

describe('CardHeader', () => {
  it('should render CardHeader', () => {
    render(
      <Card>
        <CardHeader>Header Content</CardHeader>
      </Card>
    );
    expect(screen.getByText('Header Content')).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('should render CardTitle with text', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>My Title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('should have title styling', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Heading</CardTitle>
        </CardHeader>
      </Card>
    );
    const title = screen.getByText('Heading');
    expect(title).toHaveClass('font-semibold');
  });
});

describe('CardDescription', () => {
  it('should render CardDescription', () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Description text</CardDescription>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('should render CardContent', () => {
    render(
      <Card>
        <CardContent>Main content</CardContent>
      </Card>
    );
    expect(screen.getByText('Main content')).toBeInTheDocument();
  });
});

describe('CardFooter', () => {
  it('should render CardFooter', () => {
    render(
      <Card>
        <CardFooter>Footer content</CardFooter>
      </Card>
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});

describe('Complete Card', () => {
  it('should render full card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
