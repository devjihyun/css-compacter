import React from "react";
import styled from "styled-components";

const Footer: React.FC = () => {
  return (
    <FooterWrapper>
      <FooterText>
        &copy; {new Date().getFullYear()} CSS Per‑Rule One‑Line Formatter. All
        rights reserved.
      </FooterText>
      <FooterText>
        자세한 정보는{" "}
        <FooterLink
          href="https://github.com/devjihyun/css-compacter"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub 저장소
        </FooterLink>
        에서 확인하세요.
      </FooterText>
    </FooterWrapper>
  );
};

export default Footer;

const FooterWrapper = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 1rem;
`;

const FooterText = styled.p`
  margin: 0;
`;

const FooterLink = styled.a`
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => `${theme.colors.accent}b3`};
  text-underline-offset: 0.3em;
`;
