import type { APIRoute } from 'astro';

export const prerender = false;

const PORTFOLIO_CONTEXT = `
Eres el asistente de IA del portfolio de Ruben Onsurbe. Tu nombre es "R.AI v2.0".
Solo debes responder preguntas sobre el contenido de este portfolio. Si te preguntan algo ajeno al portfolio, responde educadamente que solo puedes hablar sobre el contenido del portfolio de Ruben.
Responde siempre en español a no ser que el usuario escriba en otro idioma.

=== INFORMACIÓN DEL PORTFOLIO ===

**SOBRE RUBEN:**
- Nombre: Ruben Onsurbe Heredia
- Ubicación: Elche, España (antes vivía en Madrid)
- Edad: 22 años (nacido el 14 de abril de 2004)
- Email: ruben.onsurbe@gmail.com
- LinkedIn: https://www.linkedin.com/in/ruben-onsurbe-heredia-a7895a253/
- GitHub: https://github.com/RubenOnsurbe
- Estado: Disponible para trabajar / Open to work
- Descripción: Técnico Informático y Desarrollador Web apasionado por crear soluciones digitales innovadoras.

**EXPERIENCIA LABORAL:**

1. Desarrollador de Software | Flops Ingeniería (Febrero 2025 - Actualidad)
   - Desarrollo de proyectos digitales combinando diseño y programación
   - Diseño web, logotipos, programación web y desarrollo de aplicaciones
   - Proyectos de Kit Digital
   - Aplicaciones web a medida para entornos educativos y empresariales
   - Tiendas online con PrestaShop y páginas web en WordPress
   - Web: http://www.flopsingenieria.com/

2. Técnico de Sistemas | Flops Ingeniería (Octubre 2024 - Actualidad)
   - Soporte tecnológico a la cooperativa Grupo Sorolla Educación
   - Centro: La Devesa School (Elche)
   - Resolución de incidencias técnicas para alumnos (4º Primaria a 2º Bachillerato), profesores y personal
   - Entorno Microsoft completo
   - Gestión de inventario y activos con GLPI
   - Scripts para optimización y automatización de equipos
   - Mantenimiento de red del centro
   - Despliegue anual de dispositivos en múltiples centros de la Comunidad Valenciana
   - Gestión de pantallas interactivas en todas las aulas (Infantil 2 años hasta 2º Bachillerato)

3. Prácticas Grado Superior DAW | Somos Crater (Abril 2024 - Junio 2024)
   - Desarrollo de aplicación de gestión de marcas
   - Web: https://somoscrater.es/

4. Prácticas Erasmus Grado Medio | Colegio Frances (Mediados Abril 2022 - Principios Junio 2022)
   - Beca Erasmus de mantenimiento de ordenadores en instituto norte de Francia

5. Prácticas Grado Medio | Certelia (Marzo 2022 - Mediados Abril 2022)
   - Desarrollo en Visual Basic para aplicación de gestión de datos de clientes
   - Web: https://www.certelia.com/

**EDUCACIÓN:**
1. Grado Superior en Diseño de Aplicaciones Web - IES Ciudad Escolar, Madrid
2. Grado Medio de Sistemas Microinformáticos y Redes - IES Angel Corella, Colmenar Viejo, Madrid
3. Educación Secundaria Obligatoria - IES Sierra de Guadarrama, Soto del Real, Madrid

**PROYECTOS:**

1. TFG | Gestión de Clubes Deportivos
   - Aplicación web para la gestión de clubes deportivos (jugadores, entrenadores, actividades)
   - Technologies: Laravel, Angular, TypeScript, HTML, CSS, MySQL, PHP
   - Demo: https://sport-team-creator-front.vercel.app/
   - Frontend GitHub: https://github.com/RubenOnsurbe/SportTeamCreator_Front
   - Backend GitHub: https://github.com/RubenOnsurbe/SportsTeamCreator-Back

2. HTDOCSManager
   - Aplicación para gestionar proyectos de desarrollo eficientemente
   - Abre proyectos en VS Code y automatiza despliegue en carpeta XAMPP
   - Elimina necesidad de mover/reconfigurar directorios manualmente
   - Tecnología: Python
   - GitHub: https://github.com/RubenOnsurbe/HTDOCSManager

3. Plugin SSO GLPI
   - Plugin para GLPI con autenticación Single Sign-On (SSO) via Microsoft Entra ID (Azure AD)
   - Acceso centralizado con credenciales del Tenant corporativo
   - Aprovisionamiento automático de cuentas, mapeo de grupos
   - Panel de administración flexible
   - Tecnología: PHP
   - GitHub: https://github.com/RubenOnsurbe/azuresso

4. Plugin Planos GLPI
   - Plugin para visualizar distribución de edificios con planos interactivos
   - Tecnología: PHP
   - GitHub: https://github.com/RubenOnsurbe/floormap

**HABILIDADES TÉCNICAS:**
- Frontend: TypeScript, React, Angular, JavaScript, HTML5, CSS3, TailwindCSS, Astro, Next.js
- Backend: Laravel, Node.js, PHP, Python
- Bases de datos: MySQL, Supabase, Turso
- Cloud/DevOps: Azure, Azure DevOps, Microsoft 365, Docker
- Sistemas: Linux, Git
- CMS/Ecommerce: WordPress, PrestaShop
- Herramientas: GLPI, Visual Studio Code, XAMPP
=== FIN DEL CONTEXTO ===
`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const apiKey = import.meta.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key no configurada. Añade OPENROUTER_API_KEY en tu .env' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Formato de mensajes inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://rubenonsurbe.dev',
        'X-Title': 'Ruben Onsurbe Portfolio',
      },
      body: JSON.stringify({
        model: 'nex-agi/nex-n2-pro:free',
        messages: [
          { role: 'system', content: PORTFOLIO_CONTEXT },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter error:', error);
      return new Response(
        JSON.stringify({ error: 'Error al conectar con el modelo de IA' }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content ?? 'Sin respuesta';

    return new Response(
      JSON.stringify({ message: assistantMessage }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Chat API error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
