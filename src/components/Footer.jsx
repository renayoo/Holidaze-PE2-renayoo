function Footer() {
  return (
    <>
      <div
        className="w-full h-[120px] bg-repeat-x bg-[length:auto_100%] -mb-6"
        style={{
          backgroundImage: 'url("/assets/images/paradise-footer.png")',
        }}
      ></div>

      <footer className="bg-header-dark-turqoiuse text-center py-6 mt-0 relative z-10">
        <p className="font-pacifico text-sm text-white">
          © {new Date().getFullYear()} Holidaze. All rights reserved.
        </p>
        <p className="font-pacifico text-xs text-white mt-2">
          By renayoo 🧡 Eksamen Noroff Frontend
        </p>
      </footer>
    </>
  );
}

export default Footer;
