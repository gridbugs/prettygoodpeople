require 'rubygems'
require 'sinatra'
require 'data_mapper'
require 'json'

set :bind, 'localhost'
set :port, 4567

enable :sessions

# connect to database
DataMapper::Logger.new($stdout, :debug)
DataMapper.setup(:default, 'mysql://steve@localhost/test')
load 'models.rb'

DataMapper::Model.raise_on_save_failure = true 

# non-kernel calls
get '/' do
  redirect '/index.html'
end

post '/login' do
  user = User.first(:username => params[:username])
  if user.password == params[:password] then
    session[:user] = user
    return "0"
  else
    return "1"
  end
end

# kernel calls
get '/get-public-key' do
  username = params[:username]
  user = User.first(:username => username)
  {
    :id => user.id,
    :publickey => user.publickey
  }.to_json
end

post '/update-public-key' do
end

get '/get-messages' do
  count = params[:count].to_i
  Message.all(:limit => count, :user_id => session[:user].id).to_json

end

get '/get-message-count' do
  Message.count(:user_id => session[:user].id).to_s
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
