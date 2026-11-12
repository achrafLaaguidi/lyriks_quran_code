import { Component } from 'react';
import { Link } from 'react-router-dom';

export function PageHeading({ eyebrow, title, children }) {
  return (
    <header className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </header>
  );
}
export function LoadingState() {
  return (
    <div className="state" role="status">
      <span className="loading-dot" /> جارٍ تحميل المحتوى…
    </div>
  );
}
export function ErrorState({ retry, children }) {
  return (
    <div className="state" role="alert">
      <h2>تعذّر تحميل المحتوى</h2>
      <p>{children || 'يرجى التحقق من اتصالك والمحاولة مرة أخرى.'}</p>
      {retry && (
        <button type="button" onClick={retry}>
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = 'ابحث في المحتوى…',
}) {
  return (
    <label className="search-field">
      <span>بحث</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
export class ContentBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    const { failed } = this.state;
    const { children } = this.props;
    return failed ? (
      <ErrorState retry={() => this.setState({ failed: false })}>
        حدث خطأ أثناء عرض المحتوى. يمكنك إعادة المحاولة أو{' '}
        <Link to="/">العودة للرئيسية</Link>.
      </ErrorState>
    ) : (
      children
    );
  }
}
