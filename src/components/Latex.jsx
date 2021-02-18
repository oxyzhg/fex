import React from 'react';

// @ts-ignore
export default function ({ exp }) {
  return <img src={'https://latex.codecogs.com/gif.latex?' + exp} alt={exp}></img>;
}
