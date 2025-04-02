import { Inter } from 'next/font/google'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
})

export default function BookingLayout({ children }) {
  return (
    <div className={`${poppins.variable}`}>
      <div 
        className="min-h-screen bg-villa bg-cover bg-fixed bg-center"
        style={{
          position: 'relative',
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm -z-10"></div>
        {children}
      </div>
    </div>
  )
}