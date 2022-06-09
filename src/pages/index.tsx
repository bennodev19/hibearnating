import type {NextPage} from 'next';
import DropZone from "../ui/components/DropZone";
import styled from "styled-components";
import {onDownload, onDrop} from '../controller';
import {IS_LOADING, IMAGE_URL} from "../core";
import {useAgile} from "@agile-ts/react";
import Head from 'next/head';

const Home: NextPage = () => {
    const [isLoading, image] = useAgile([IS_LOADING, IMAGE_URL]);

    return (
        <>
            <Head>
                <title>HiBEARnating 🥶</title>
            </Head>
            <Container>
                <DropZone onDrop={onDrop} isLoading={isLoading}/>
                {image != null &&
                    <ImageContainer onClick={() => onDownload(image)
                    }>
                        <img src={image} width={256} height={256}/>
                    </ImageContainer>}
            </Container>
        </>
    );
}

export default Home;

const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100vh;

  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-image: url('/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  margin-top: 20px;
  background: #FAF4E8;
  border: 2px solid #B99673;
  border-radius: 5px;
  cursor: pointer;
  filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.25));
`;
