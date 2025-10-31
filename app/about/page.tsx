import { supabase } from '@/lib/supabase';

async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category, order_index');

  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }

  return data || [];
}

async function getExperience() {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('order_index');

  if (error) {
    console.error('Error fetching experience:', error);
    return [];
  }

  return data || [];
}

export default async function AboutPage() {
  const skills = await getSkills();
  const experience = await getExperience();

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
        <p className="text-xl text-gray-600 mb-12">
          Learn more about my skills and professional experience
        </p>

        {Object.keys(skillsByCategory).length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Skills</h2>
            <div className="space-y-8">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 capitalize">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="bg-white p-4 rounded-lg shadow-sm border"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">
                            {skill.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-slate-900 h-2 rounded-full transition-all"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-white p-6 rounded-lg shadow-md border-l-4 border-slate-900"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="text-lg text-gray-700">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {new Date(exp.start_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                        {' - '}
                        {exp.current
                          ? 'Present'
                          : exp.end_date
                          ? new Date(exp.end_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })
                          : 'N/A'}
                      </p>
                      {exp.location && (
                        <p className="text-sm text-gray-500">{exp.location}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{exp.description}</p>
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech: string) => (
                        <span
                          key={tech}
                          className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
