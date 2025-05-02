import { Sun } from "lucide-react"

const Header = () => {
  // Get current date and time
  const now = new Date()
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

  return (
    <header className="bg-[#C8E6C9] p-4 flex justify-end items-center font-poppins">
      <div className="flex items-center">
        <Sun className="w-6 h-6 text-yellow-400 mr-2" />
        <div className="text-right">
          <p className="font-semibold">Good Morning</p>
          <p className="text-sm">
            {date} &nbsp; {time}
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
