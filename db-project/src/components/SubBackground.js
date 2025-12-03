const SubBackground = () => {
    return (
      <div
        className={`overflow-hidden fixed inset-0 pointer-events-none`}
        style={{
          backgroundImage: "var(--sub-image-src)",
          backgroundRepeat: "no-repeat",
          opacity: "0.1",
          backgroundSize: "cover"
        }}
      />
    );
  }
  
  export default SubBackground;