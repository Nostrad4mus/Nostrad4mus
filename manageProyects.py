import json
import os
from pathlib import Path

PROJECTS_FILE = Path("assets/data/projects.json")

def load_projects():
    if not PROJECTS_FILE.exists():
        return []
    with open(PROJECTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_projects(projects):
    PROJECTS_FILE.parent.mkdir(exist_ok=True)
    with open(PROJECTS_FILE, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)

def add_project():
    projects = load_projects()
    new_id = max(p["id"] for p in projects) + 1 if projects else 1
    
    print("\n" + "="*40)
    print(f"Agregando Proyecto ID: {new_id}")
    print("="*40)
    
    project = {
        "id": new_id,
        "name": input("Nombre del proyecto: "),
        "type": input("Tipo (software/hardware/both): ").lower(),
        "status": input("Estado (completed/in-progress/archived): "),
        "description": input("Descripción: "),
        "technologies": input("Tecnologías (separadas por comas): ").split(","),
        "tags": input("Etiquetas (separadas por comas): ").split(","),
        "image": input("Ruta de imagen principal: "),
        "thumbnail": input("Ruta de thumbnail (opcional): "),
        "date": input("Fecha (YYYY-MM-DD): "),
        "links": [],
        "features": input("Características principales (separadas por |): ").split("|"),
        "team": input("¿Es trabajo en equipo? (true/false): ").lower() == "true",
        "client": input("Cliente (opcional): ") or None
    }
    
    # Añadir enlaces
    while True:
        print("\nAgregar enlace (dejar tipo vacío para terminar):")
        link_type = input("Tipo (github/youtube/demo/documentation/website): ")
        if not link_type:
            break
        project["links"].append({
            "type": link_type,
            "url": input("URL: "),
            "description": input("Descripción (opcional): ") or None
        })
    
    projects.append(project)
    save_projects(projects)
    print("\n✅ Proyecto agregado exitosamente!")

def list_projects():
    projects = load_projects()
    print("\n" + "="*40)
    print(f"Listado de Proyectos ({len(projects)})")
    print("="*40)
    for p in projects:
        print(f"ID: {p['id']} | {p['name']} ({p['type']})")
        print(f"Tech: {', '.join(p['technologies'])}")
        print("-" * 30)

def delete_project():
    projects = load_projects()
    list_projects()
    try:
        project_id = int(input("\nID del proyecto a eliminar: "))
        projects = [p for p in projects if p["id"] != project_id]
        
        # Reasignar IDs
        for i, p in enumerate(projects, 1):
            p["id"] = i
        
        save_projects(projects)
        print("\n🗑️ Proyecto eliminado y IDs actualizados!")
    except ValueError:
        print("❌ Error: ID debe ser un número")

def main():
    while True:
        print("\n" + "="*40)
        print("Gestor de Proyectos Portafolio")
        print("="*40)
        print("1. Agregar proyecto")
        print("2. Listar proyectos")
        print("3. Eliminar proyecto")
        print("4. Salir")
        
        choice = input("\nSeleccione una opción: ")
        
        if choice == "1":
            add_project()
        elif choice == "2":
            list_projects()
        elif choice == "3":
            delete_project()
        elif choice == "4":
            break
        else:
            print("❌ Opción no válida")

if __name__ == "__main__":
    main()