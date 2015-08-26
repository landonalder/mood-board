Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: 'registrations' }
  resources :moods, param: :slug, only: [:index]

  resources :users, except: :create, param: :slug do
    resources :moods, only: [:show, :edit, :create]
  end

  root 'moods#index'
end
