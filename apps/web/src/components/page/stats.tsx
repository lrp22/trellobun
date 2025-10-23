export function Stats() {
  const stats = [
    { value: "2M+", label: "Active users" },
    { value: "50M+", label: "Tasks completed" },
    { value: "99.9%", label: "Uptime" },
    { value: "150+", label: "Countries" },
  ];

  return (
    <section className="border-y bg-muted/30 py-16">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
