import type { FC } from 'react'
import style from './skills.module.scss'

interface ISkillCardProps {
  label: string
  icon: string
  glowColor?: string
}

const SkillCard: FC<ISkillCardProps> = ({ label, icon, glowColor = 'rgba(56, 189, 248, 0.5)' }) => {
  return (
    <div
      className={style.skills__card}
      style={{ '--glow-color': glowColor } as React.CSSProperties}
    >
      <div className={style.skills__shimmer} />
      <div className={style.skills__iconWrap}>
        <img src={icon} alt="" className={style.skills__img} />
      </div>
      <span className={style.skills__label}>{label}</span>
    </div>
  )
}

export default SkillCard