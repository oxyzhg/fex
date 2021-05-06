import React from 'react';

const typeMap = {
  Easy: '#5AB726',
  Medium: '#FFA119',
  Hard: '#EF4743',
};

interface IProps {
  type: 'Easy' | 'Medium' | 'Hard';
}

export default function LeetCodeType(props: IProps) {
  const { type } = props;
  const style = {
    UserSelect: 'none',
    marginLeft: '6px',
    fontSize: '12px',
    fontFamily: 'Consolas,monospace',
    color: typeMap[type],
  };

  return <span style={style}>{type}</span>;
}
