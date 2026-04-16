import { useEffect, useState } from 'react'

export function useProfileAge() {
  const [currentAge, setCurrentAge] = useState<number | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (!response.ok) return

        const data = await response.json()
        if (typeof data?.currentAge === 'number') {
          setCurrentAge(data.currentAge)
        }
      } catch {
        // Age is optional display data.
      }
    }

    void fetchProfile()
  }, [])

  return { currentAge }
}
