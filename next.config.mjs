/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'recharts',
    'exceljs',
    'jspdf',
    'jspdf-autotable',
    'html2canvas'
  ],
}

export default nextConfig
