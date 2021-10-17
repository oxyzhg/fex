/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

type FeatureItem = {
  title: string;
  image: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Front End',
    image: 'img/features/dolphins_show.svg',
    description: (
      <>
        The main contents include <b>JavaScript, ESNext, React, Vue.js, Node.js, Browser</b>, etc.
      </>
    ),
  },
  {
    title: 'Engineering',
    image: 'img/features/dolphins_and_girl.svg',
    description: (
      <>
        The main contents include <b>Webpack, Babel, Rollup, Vite, ESBuild, Micro Frontend</b>, etc.
      </>
    ),
  },
  {
    title: 'Best Practices',
    image: 'img/features/dolphins_in_the_ocean.svg',
    description: (
      <>
        It mainly involves some <b>good practices</b> in the community.
      </>
    ),
  },
];

function Feature({title, image, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img className={styles.featureSvg} alt={title} src={image} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
