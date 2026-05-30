export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/logo.png" alt="ANG Group Logo" className="h-12 w-auto object-contain" />
    </div>
  );
}
