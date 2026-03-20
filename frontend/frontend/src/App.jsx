import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { ThemeProvider } from "./components/ThemeProvider"

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  )
}
