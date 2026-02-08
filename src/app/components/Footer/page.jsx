"use client";
import React from 'react';
import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  background-color: #f7f7f7;
  border-top: 1px solid #dddddd;
  padding: 48px 80px;
  font-family: Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    font-size: 14px;
    font-weight: 600;
    color: #222222;
    margin-bottom: 12px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 12px;
  }

  a {
    text-decoration: none;
    color: #222222;
    font-size: 14px;
    font-weight: 400;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Footer() {
  const footerData = [
    {
      title: "Support",
      links: [
        "Help Centre", "Get help with a safety issue", "AirCover",
        "Anti-discrimination", "Disability support", "Cancellation options",
        "Report neighbourhood concern"
      ]
    },
    {
      title: "Hosting",
      links: [
        "Airbnb your home", "Airbnb your experience", "Airbnb your service",
        "AirCover for Hosts", "Hosting resources", "Community forum",
        "Hosting responsibly", "Join a free Hosting class", "Find a co-host", "Refer a host"
      ]
    },
    {
      title: "Airbnb",
      links: [
        "2025 Summer Release", "Newsroom", "Careers",
        "Investors", "Airbnb.org emergency stays"
      ]
    }
  ];

  return (
    <FooterContainer>
      <FooterContent>
        {footerData.map((section, index) => (
          <FooterSection key={index}>
            <h3>{section.title}</h3>
            <ul>
              {section.links.map((link, i) => (
                <li key={i}>
                  <a href="#">{link}</a>
                </li>
              ))}
            </ul>
          </FooterSection>
        ))}
      </FooterContent>
    </FooterContainer>
  );
}