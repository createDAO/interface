import { DAO_VERSIONS } from '@config/dao'
import styles from './VersionSelect.module.css'

interface VersionSelectProps {
  value: string
  onChange: (version: string) => void
}

export function VersionSelect({ value, onChange }: VersionSelectProps) {
  return (
    <div className={styles.selectContainer}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.select}
      >
        {DAO_VERSIONS.map((version) => (
          <option
            key={version.id}
            value={version.id}
            disabled={!version.isAvailable}
            title={version.description}
          >
            {version.name}
          </option>
        ))}
      </select>
    </div>
  )
}
