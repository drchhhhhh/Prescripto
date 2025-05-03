import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

const Header = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const date = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })

  const hour = now.getHours()
  let greeting = "Good Morning"
  let isNight = false

  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon"
  } else if (hour >= 17 || hour < 5) {
    greeting = "Good Evening"
    isNight = true
  }

  return (
    <header className="bg-[#C8E6C9] p-4 flex justify-end items-center font-poppins">
      <div className="flex items-center space-x-2">
        {isNight ? (
          <Moon className="w-6 h-6 text-blue-500" />
        ) : (
          <Sun className="w-6 h-6 text-yellow-400" />
        )}
        <div className="text-right">
          <p className="font-semibold">{greeting}</p>
          <p className="text-sm">
            {date} &nbsp; {time}
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
