import type { FC } from 'react'
import style from './skills.module.scss'

interface ISkillCardProps {
  label: string,
  icon: string
}

const SkillCard: FC<ISkillCardProps> = ({ label, icon }) => {

  return (
    <div className={style.skills__card}>
      <img src={icon} alt="" className={style.skills__img} />
      <span className={style.skills__label}>{label}</span>
    </div>
  )
}

export default SkillCard