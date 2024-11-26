import { NavLink, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <header className="bg-blue-950 p-4 w-full flex items-center justify-center">
          <nav className="list-none  w-full flex justify-center items-center gap-5">
            <div>
              <img
                src="/logo_shopper_car.svg"
                width={80}
                alt="Logo Shopper personalizada como um Carro"
              />
            </div>
            <NavLink to={"/"} className={"px-3 py-2 block hover:text-zinc-400 hover:scale-95 transition"}>Solicitar Viagem</NavLink>
            <NavLink to={"/history"} className={"px-3 py-2 block hover:text-zinc-400 hover:scale-95 transition"}>Histórico</NavLink>
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <footer className="p-4 bg-blue-950 flex flex-col gap-4 justify-center items-center text-xl text-center text-white">
        <p>
          Desenvolvido por Leonardo de Sant'Ana para o case de desenvolvedor
          FullStack
        </p>
        <p>©️Shopper.com.br - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

export default App;
