-- Comunidades iniciales de One More Step.
-- Idempotente: se puede ejecutar varias veces sin duplicar.

insert into public.communities (slug, name, description, icon, color, sort_order) values
  ('emprendimiento',       'Emprendimiento',          'Para quienes están lanzando su primera idea o haciendo crecer un proyecto propio.', '🚀', '#f97316', 10),
  ('negocios',             'Negocios',                'Estrategia, ventas, clientes y todo lo que hace que un negocio funcione.',          '💼', '#0ea5e9', 20),
  ('tecnologia',           'Tecnología',              'Novedades, herramientas y curiosidad por cómo funciona el mundo digital.',          '💻', '#6366f1', 30),
  ('inteligencia-artificial','Inteligencia Artificial','Aprende, experimenta y construye con IA junto a otras personas.',                  '🤖', '#8b5cf6', 40),
  ('programacion',         'Programación',            'Desde tu primer "hola mundo" hasta proyectos en producción.',                       '⌨️', '#14b8a6', 50),
  ('fitness',              'Fitness',                 'Entrenar con constancia, sin importar desde dónde empieces.',                       '💪', '#ef4444', 60),
  ('perdida-de-peso',      'Pérdida de peso',         'Bajar de peso de forma saludable, paso a paso y sin extremos.',                    '⚖️', '#f43f5e', 70),
  ('nutricion',            'Nutrición',               'Comer mejor, entender lo que comes y crear hábitos sostenibles.',                  '🥗', '#22c55e', 80),
  ('productividad',        'Productividad',           'Sistemas, rutinas y foco para avanzar en lo que importa.',                          '⏱️', '#eab308', 90),
  ('estudios',             'Estudios',                'Oposiciones, universidad, certificaciones o aprender por tu cuenta.',               '📚', '#3b82f6', 100),
  ('desarrollo-personal',  'Desarrollo personal',     'Crecer como persona: mentalidad, confianza y autoconocimiento.',                    '🌱', '#10b981', 110),
  ('finanzas-personales',  'Finanzas personales',     'Ahorro, inversión y una relación más sana con el dinero.',                          '💰', '#059669', 120),
  ('lectura',              'Lectura',                 'Leer más y compartir lo que aprendes de cada libro.',                               '📖', '#a855f7', 130),
  ('habitos',              'Hábitos',                 'Pequeñas acciones diarias que cambian resultados a largo plazo.',                   '🔁', '#06b6d4', 140),
  ('gaming',               'Gaming',                  'Mejorar, competir y crear en torno a los videojuegos.',                             '🎮', '#7c3aed', 150),
  ('creatividad',          'Creatividad',             'Escribir, grabar, crear: dale salida a tus ideas.',                                 '💡', '#f59e0b', 160),
  ('arte-y-diseno',        'Arte y diseño',           'Dibujo, diseño gráfico, UI, fotografía y cualquier forma de arte visual.',          '🎨', '#ec4899', 170)
on conflict (slug) do update set
  name        = excluded.name,
  description = excluded.description,
  icon        = excluded.icon,
  color       = excluded.color,
  sort_order  = excluded.sort_order;
