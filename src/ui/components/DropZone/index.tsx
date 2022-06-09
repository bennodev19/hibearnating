import React from 'react';
import styled from "styled-components";
import PlusIcon from "./components/PlusIcon";
import {useDropzone} from 'react-dropzone';

const DropZone: React.FC<Props> = (props) => {
    const {onDrop, isLoading} = props;
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    return (
        <Container {...getRootProps()} isDragActive={isDragActive} disabled={isLoading}>
            <DropField {...getInputProps()} disabled={isLoading} />
            <ContentContainer>
                {!isLoading && <PlusIcon/>}
                <InfoText>
                    {isLoading ? 'Loading..' : 'Drag your Okay Bear here and let him hibearnate.'}
                </InfoText>
            </ContentContainer>
        </Container>
    );
};

export default DropZone;

type Props = {
    onDrop: (acceptedFiles: File[]) => void;
    isLoading: boolean
};

const Container = styled.div<{ isDragActive: boolean, disabled: boolean }>`
  display: flex;
  align-items: center;
  padding: 25px;
  pointer-events: ${({disabled}) => disabled ? 'none' : 'all'};
  background: ${({isDragActive}) =>
          isDragActive ? "#FFF9EF" : "#FAF4E8"};
  border: ${({isDragActive}) =>
          isDragActive ? "4px" : "2px"} solid ${({isDragActive}) =>
          isDragActive ? "#19AB6D" : "#B99673"};
  border-radius: 5px;
  cursor: pointer;
  filter: drop-shadow(0px ${({isDragActive}) => (isDragActive ? '8px 14px' : '4px 10px')} rgba(0, 0, 0, 0.25));
  transition: all 200ms ease;

  &:hover {
    border-color: #19AB6D;
    background: #FFF9EF;
    border-width: 4px;
    filter: drop-shadow(0px 8px 14px rgba(0, 0, 0, 0.25));
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DropField = styled.input`
  display: flex;
  flex: 1;
`;

const InfoText = styled.p`
  color: #3F2D28;
  margin-left: 10px;
`;