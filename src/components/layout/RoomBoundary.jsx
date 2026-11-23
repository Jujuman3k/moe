import { Component } from 'react';

// A version change between navigation and loading a lazy chunk should not
// strand someone at a blank screen. Reload preserves the exact hash/lesson.
export class RoomBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <section className="studio-load-error" aria-labelledby="load-error-title">
      <h1 id="load-error-title">Rommet kunne ikke åpnes</h1>
      <p>Prøv å laste inn denne siden på nytt. Lagret kursprogresjon beholdes i nettleseren.</p>
      <button type="button" onClick={() => window.location.reload()}>Last inn på nytt</button>{' '}
      <a href="#home">Til forsiden</a>
    </section>;
  }
}
