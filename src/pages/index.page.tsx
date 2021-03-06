import type { NextPage } from 'next';
import DropZone from '../ui/components/input/DropZone';
import styled from 'styled-components';
import { onDownload, onDrop } from './index.controller';
import { IS_LOADING, IMAGE_URL } from '../core';
import { useAgile } from '@agile-ts/react';
import Head from 'next/head';
import { appConfig } from '../config';

const Home: NextPage = () => {
  const [isLoading, image] = useAgile([IS_LOADING, IMAGE_URL]);

  return (
    <>
      <Head>
        <title>HiBEARnating 🥶</title>

        {/* Title */}
        <meta property="og:title" content={appConfig.meta.title} />
        <meta name="twitter:title" content={appConfig.meta.title} />

        <meta name="theme-color" content={appConfig.meta.color} />
        <link rel="shortcut icon" href={'/favicon.ico'} />

        {/* Description */}
        <meta name="description" content={appConfig.meta.description} />
        <meta name="og:description" content={appConfig.meta.description} />
        <meta name="twitter:description" content={appConfig.meta.description} />

        {/* Image */}
        <meta property="image" content={appConfig.meta.bannerUrl} />
        <meta property="og:image" content={appConfig.meta.bannerUrl} />
        <meta name="twitter:image" content={appConfig.meta.bannerUrl} />
        <meta name="twitter:image:src" content={appConfig.meta.bannerUrl} />

        <meta name="twitter:image:alt" content={`Image for "HiBEARnating"`} />

        {/* Makes Image Large */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Creator */}
        <meta name="twitter:creator" content={appConfig.meta.creator} />
      </Head>

      <Container hasHibearnated={image != null}>
        <DropZone onDrop={onDrop} isLoading={isLoading} />
        {image != null && (
          <ImageContainer onClick={() => onDownload(image)}>
            <img src={image} width={256} height={256} />
          </ImageContainer>
        )}
      </Container>
    </>
  );
};

export default Home;

const Container = styled.div<{ hasHibearnated: boolean }>`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100vh;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url(${({ hasHibearnated }) =>
    `/${hasHibearnated ? 'background_frozen' : 'background'}.jpg`});
  background-size: cover;
  background-repeat: no-repeat;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  margin-top: 20px;
  background: #faf4e8;
  border: 2px solid #b99673;
  border-radius: 5px;
  cursor: pointer;
  filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));
`;
