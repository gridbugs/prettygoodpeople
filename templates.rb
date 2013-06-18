$templates = {}

def load_templates
  puts "Loading templates"
  Dir.glob("templates/*.erb") do |template|
    template =~ /templates\/(.*).erb/
    name = $1
    contents = File.open(template, "r").read
    $templates[name] = contents
    puts "Loaded template: #{name}"
  end
end
