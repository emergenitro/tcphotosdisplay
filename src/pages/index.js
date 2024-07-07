import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import Button from '@components/Button';
import Container from '@components/Container';
import Layout from '@components/Layout';

import { mapImageResources, search } from '../lib/cloudinary';

import styles from '@styles/Home.module.scss';

export default function Home({ images: defaultImages, nextCursor: defaultNextCursor, totalCount: defaultTotalCount }) {
  const [images, setImages] = useState(defaultImages);
  const [nextCursor, setNextCursor] = useState(defaultNextCursor);
  const [totalCount, setTotalCount] = useState(defaultTotalCount);
  const [activeFolder, setActiveFolder] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  async function handleOnLoadMore(e) {
    e.preventDefault();

    const results = await fetch('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        expression: `folder=""`,
        nextCursor
      })
    }).then(r => r.json());

    const { resources, next_cursor: nextPageCursor, total_count: updatedTotalCount } = results;

    const images = mapImageResources(resources);

    setImages(prev => {
      return [
        ...prev,
        ...images
      ]
    });
    setNextCursor(nextPageCursor);
    setTotalCount(updatedTotalCount);
  }

  function handleOnFolderClick(e) {
    const folderPath = e.target.dataset.folderPath;
    setActiveFolder(folderPath)
    setNextCursor(undefined);
    setImages([]);
    setTotalCount(0);
  }

  useEffect(() => {
    (async function run() {
      const results = await fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({
          expression: `folder="${activeFolder || ''}"`
        })
      }).then(r => r.json());

      const { resources, next_cursor: nextPageCursor, total_count: updatedTotalCount } = results;

      const images = mapImageResources(resources);

      setImages(images);
      setNextCursor(nextPageCursor);
      setTotalCount(updatedTotalCount);
    })();
  }, [activeFolder]);

  function openModal(image) {
    setCurrentImage(image);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }


  return (
    <Layout>
      <Head>
        <title>GIIS Tech Club 2K24</title>
        <meta name="description" content="All of my cool images." />
      </Head>

      <Container>
        <h1 className="sr-only">GIIS Hackathon X - 26th and 27th July 2K24</h1>

        <h2 className={styles.header}>Images</h2>

        <ul className={styles.images}>
          {images.map(image => (
            <li key={image.id}>
              <a href={image.link} rel="noreferrer" onClick={(e) => {
                e.preventDefault(); // Prevent the default link behavior
                openModal(image); // Pass the current image to openModal
              }}>
                <div className={styles.imageImage}>
                  <Image width={image.width} height={image.height} src={image.image} alt="" />
                </div>
              </a>
              {isModalOpen && currentImage && currentImage.id === image.id && (
                <div id="myModal" className={styles.modal} onClick={closeModal}>
                  <span className={styles.close}>&times;</span>
                  <Image src={currentImage.image} className={styles.modalContent} alt="" width={currentImage.width} height={currentImage.height} />
                </div>
              )}
            </li>
          ))}
        </ul>
        {totalCount > images.length && (
          <p>
            <Button onClick={handleOnLoadMore}>Load More Results</Button>
          </p>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps() {
  const results = await search({
    expression: 'folder=""'
  });

  const { resources, next_cursor: nextCursor, total_count: totalCount } = results;

  const images = mapImageResources(resources);


  return {
    props: {
      images,
      nextCursor,
      totalCount
    }
  }
}