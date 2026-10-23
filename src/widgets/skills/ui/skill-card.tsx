import type { FC } from 'react';
import Image from 'next/image';
import style from './skills.module.scss';

interface ISkillCardProps {
  label: string;
  icon: string;
  glowColor?: string;
}

export const SkillCard: FC<ISkillCardProps> = ({ label, icon, glowColor = 'rgba(56, 189, 248, 0.5)' }) => {
  return (
    <div className={style.skills__card} style={{ '--glow-color': glowColor } as React.CSSProperties}>
      <div className={style.skills__shimmer} />
      <div className={style.skills__iconWrap}>
        <Image src={icon} alt="" width={40} height={40} unoptimized className={style.skills__img} />
      </div>
      <span className={style.skills__label}>{label}</span>
    </div>
  );
};
