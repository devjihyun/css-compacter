export const sampleCss = `/* hero block */
.hero {
  color: #222;
  padding: 24px 32px;
  margin: 0 0 24px 0;
  border: 1px solid #ccc;
  background: linear-gradient(135deg, #fff, #f5f7fb);
  font-size: 18px; /* convert me */
  line-height: 1.6;
  --gap: 12px;
}

.hero .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  gap: var(--gap);
  text-decoration: none;
  background: #0066ff;
  color: #fff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.14);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  padding: 32px;
}

.card {
  border-radius: 18px;
  background: #101521;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px 22px;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 44px rgba(0, 0, 0, 0.32);
}

.card h3 {
  margin: 0 0 12px 0;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}`;
