import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  image?: string;
  quote?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  image = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80",
  quote = '"Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh phúc."',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex min-h-[500px]">
        <div
          className="hidden md:flex md:w-1/2 bg-cover bg-center items-center justify-center relative"
          style={{ backgroundImage: `url('${image}')` }}
        >
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          <div className="relative z-10 p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-4 font-heading">HUST LMS</h2>
            <p className="text-lg italic opacity-90">{quote}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-dark mb-2">{title}</h1>
            <p className="text-secondary text-sm">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
