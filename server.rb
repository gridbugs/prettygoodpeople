require 'rubygems'
require 'sinatra'
require 'data_mapper'


set :bind, 'localhost'
set :port, 4567

# connect to database
DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'mysql://steve@localhost/test')
load 'models.rb'

DataMapper::Model.raise_on_save_failure = true 

# non-kernel calls
get '/' do
  redirect '/index.html'
end

# kernel calls
get '/get-public-key' do
  username = params[:username]
  user = User.first(:username => username)
  publickey = user.publickey.gsub(%r{\n}, "\\n").gsub(%r{\r}, "\\r")
  a = '{"id": "' << user.id.to_s << '", "publickey": "' << publickey << '"}'
  puts a
  return a
end

post '/update-public-key' do
end

get '/get-messages' do
end

get '/get-message-count' do
end

post '/add-user' do
  username = params[:username]
  password = params[:password]
  publickey = params[:publickey]
  begin
    User.create(:username => username, :password => password, :publickey => publickey)
    return "0"
  rescue
    return "1"
  end
end

post '/remove-user' do
end

post '/send-message' do
  user_id = params[:user_id]
  body = params[:body]
  begin
    Message.create(:user_id => user_id, :body => body)
    return "0"
  rescue
    return "1"
  end
end

post '/remove-user' do
end
