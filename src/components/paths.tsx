'use client';

import { memo, type FC } from 'react';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface Box {
  title: string;
  description: string;
  link: string;
}

interface PathsProps {
  boxes: Box[];
  className?: string;
}

const PathsComponent: FC<PathsProps> = ({ boxes, className = '' }) => {
  return (
    <div className={`${className}`}>
      <div className="w-full h-full flex flex-row flex-wrap items-center justify-center gap-5">
        {boxes.map((box) => (
          <Card key={box.title} className="w-[350px]">
            <CardHeader>
              <CardTitle>{box.title}</CardTitle>
              <CardDescription>{box.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={box.link}>Open</Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const Paths = memo(PathsComponent);
